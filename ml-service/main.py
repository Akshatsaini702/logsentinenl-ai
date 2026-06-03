from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import re
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def parse_log_line(line):
    pattern = r'(\d+\.\d+\.\d+\.\d+).+?"[^"]*"\s+(\d{3})'
    match = re.search(pattern, line)
    if match:
        return {
            'ip': match.group(1),
            'status_code': int(match.group(2)),
        }
    return None

def detect_anomalies(logs_data):
    df = pd.DataFrame(logs_data)

    ip_counts = df['ip'].value_counts()
    df['ip_frequency'] = df['ip'].map(ip_counts)

    error_codes = [400, 401, 403, 404, 500, 502, 503]
    df['is_error'] = df['status_code'].apply(
        lambda x: 1 if x in error_codes else 0
    )

    # Rule-Based Detection
    df['is_anomaly'] = (
        (df['ip_frequency'] >= 5) |
        (df['status_code'].isin([401, 403, 500]))
    )

    return df.to_dict('records')

@app.get("/")
def root():
    return {"message": "LogSentinel ML Service Running"}

@app.post("/analyze")
async def analyze_logs(file: UploadFile = File(...)):
    content = await file.read()
    lines = content.decode('utf-8').splitlines()

    parsed_logs = []
    for line in lines:
        parsed = parse_log_line(line)
        if parsed:
            parsed['raw'] = line.strip()
            parsed_logs.append(parsed)

    if not parsed_logs:
        return {"error": "No valid log entries found", "logs": []}

    results = detect_anomalies(parsed_logs)

    anomalies = [r for r in results if r.get('is_anomaly')]
    normal = [r for r in results if not r.get('is_anomaly')]

    return {
        "total": len(results),
        "anomalies_count": len(anomalies),
        "normal_count": len(normal),
        "anomalies": anomalies[:20],
        "summary": {
            "high_frequency_ips": list(set([r['ip'] for r in anomalies])),
            "error_count": sum(1 for r in results if r.get('is_error'))
        }
    }