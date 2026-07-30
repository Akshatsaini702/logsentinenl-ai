import re
from collections import Counter

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI(title="LogSentinel ML Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_ANOMALIES_RETURNED = 200
ERROR_CODES = {400, 401, 403, 404, 408, 429, 500, 502, 503, 504}
HIGH_RISK_CODES = {401, 403, 500}
FREQUENCY_THRESHOLD = 5

IP_PATTERN = r"(\d{1,3}(?:\.\d{1,3}){3})"

# Ordered most-specific first. Combined/common access logs put the status code
# after the quoted request line; the fallback catches "<ip> ... <status>" forms
# such as syslog-style or JSON-ish lines.
LINE_PATTERNS = [
    re.compile(IP_PATTERN + r'.+?"[^"]*"\s+(\d{3})'),
    re.compile(IP_PATTERN + r'.+?\bstatus["\s:=]+(\d{3})\b', re.IGNORECASE),
    re.compile(IP_PATTERN + r".+?\b(\d{3})\b"),
]


def decode_bytes(raw: bytes) -> str:
    """Decode uploaded bytes, tolerating BOMs and non-UTF-8 encodings.

    Files produced by PowerShell redirection or Notepad are frequently UTF-16,
    which raises UnicodeDecodeError under a plain utf-8 decode.
    """
    if raw.startswith((b"\xff\xfe", b"\xfe\xff")):
        return raw.decode("utf-16", errors="replace")
    if raw.startswith(b"\xef\xbb\xbf"):
        return raw.decode("utf-8-sig", errors="replace")

    for encoding in ("utf-8", "utf-16", "latin-1"):
        try:
            return raw.decode(encoding)
        except (UnicodeDecodeError, UnicodeError):
            continue

    return raw.decode("utf-8", errors="replace")


def parse_log_line(line: str):
    for pattern in LINE_PATTERNS:
        match = pattern.search(line)
        if not match:
            continue

        ip, status_raw = match.group(1), match.group(2)

        # Reject values that merely look like an IPv4 address.
        if any(int(octet) > 255 for octet in ip.split(".")):
            continue

        status_code = int(status_raw)
        if not 100 <= status_code <= 599:
            continue

        return {"ip": ip, "status_code": status_code}

    return None


def detect_anomalies(logs):
    ip_counts = Counter(entry["ip"] for entry in logs)

    results = []
    for entry in logs:
        frequency = ip_counts[entry["ip"]]
        status_code = entry["status_code"]

        reasons = []
        if frequency >= FREQUENCY_THRESHOLD:
            reasons.append(f"{frequency} requests from this IP")
        if status_code in HIGH_RISK_CODES:
            reasons.append(f"high-risk status {status_code}")

        results.append(
            {
                **entry,
                "ip_frequency": frequency,
                "is_error": 1 if status_code in ERROR_CODES else 0,
                "is_anomaly": bool(reasons),
                "reason": "; ".join(reasons) or "normal traffic",
            }
        )

    return results


@app.get("/")
def root():
    return {"message": "LogSentinel ML Service Running"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/analyze")
async def analyze_logs(file: UploadFile = File(...)):
    raw = await file.read()

    if not raw:
        return JSONResponse(
            status_code=422,
            content={"error": "Uploaded file is empty", "logs": []},
        )

    lines = decode_bytes(raw).splitlines()

    parsed_logs = []
    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue

        parsed = parse_log_line(stripped)
        if parsed:
            parsed["raw"] = stripped
            parsed_logs.append(parsed)

    if not parsed_logs:
        return JSONResponse(
            status_code=422,
            content={
                "error": "No valid log entries found",
                "lines_scanned": len(lines),
                "logs": [],
            },
        )

    results = detect_anomalies(parsed_logs)

    anomalies = [entry for entry in results if entry["is_anomaly"]]
    normal_count = len(results) - len(anomalies)

    status_breakdown = Counter(entry["status_code"] for entry in anomalies)

    return {
        "total": len(results),
        "lines_scanned": len(lines),
        "anomalies_count": len(anomalies),
        "normal_count": normal_count,
        "anomalies": anomalies[:MAX_ANOMALIES_RETURNED],
        "truncated": len(anomalies) > MAX_ANOMALIES_RETURNED,
        "summary": {
            # Derived from every anomaly, not just the returned page.
            "high_frequency_ips": sorted({entry["ip"] for entry in anomalies}),
            "error_count": sum(entry["is_error"] for entry in results),
            "status_breakdown": {
                str(code): count for code, count in sorted(status_breakdown.items())
            },
        },
    }
