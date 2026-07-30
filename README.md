# LogSentinel AI

Log anomaly detection and threat monitoring for server access logs. Upload an
access log and it flags brute-force attempts, unauthorised access and error
spikes, then explains what to do about each finding.

## Features

- 📁 Upload access logs (`.log` / `.txt`, up to 10 MB) via drag & drop
- 🔎 Rule-based anomaly detection — request-frequency bursts and high-risk
  status codes (401 / 403 / 500)
- 📊 Dashboard with severity breakdown, flagged entries and suspicious IPs
- 🧠 Prioritised recommendations for each class of finding
- 🔔 Alert history persisted to MongoDB, filterable by severity, type and IP
- 📄 PDF report export

## Architecture

```
logsentinenl-ai/
├── client/       React + Tailwind + Recharts   (static host, e.g. Vercel)
├── server/       Node.js + Express             (API + alert persistence)
└── ml-service/   FastAPI                       (log parsing + detection)
```

The client talks only to `server/`, which forwards the uploaded file to
`ml-service/` and stores any resulting alerts in MongoDB. Analysis works even
when MongoDB is unavailable — only alert history is lost.

## Running locally

Three processes. Start the detection service first.

```bash
# 1. detection service  → http://localhost:8000
cd ml-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# 2. API  → http://localhost:5000
cd server
npm install
cp .env.example .env        # then fill in MONGO_URI
ML_SERVICE_URL=http://localhost:8000 npm run dev

# 3. client  → http://localhost:3000
cd client
npm install
REACT_APP_API_URL=http://localhost:5000 npm start
```

### Configuration

| Where    | Variable             | Purpose                                          |
| -------- | -------------------- | ------------------------------------------------ |
| `server` | `MONGO_URI`          | Alert history. Optional — analysis works without. |
| `server` | `ML_SERVICE_URL`     | Base URL of the detection service.                |
| `server` | `PORT`               | Usually set by the host.                          |
| `client` | `REACT_APP_API_URL`  | Base URL of the API. Baked in at build time.      |

## Log format

Each line needs an IP address and a 3-digit HTTP status code. Common and
combined access-log formats work out of the box:

```
45.33.32.156 - - [01/Jun/2025:10:00:01] "POST /login HTTP/1.1" 401 512
```

Files are decoded as UTF-8, UTF-16 or Latin-1 automatically, so logs exported
from PowerShell or Notepad are accepted.

## Detection rules

An entry is flagged when either holds:

- its source IP appears **5 or more times** in the file, or
- its status code is **401, 403 or 500**

Severity maps from the status code: 500 → Critical, 401/403 → High, otherwise
Medium.

## Testing

```bash
cd client && npm test        # component smoke tests
```

## Status

🚧 In development. Detection is rule-based; the "AI" naming reflects the intent
rather than a trained model — there is no ML model, WebSocket transport or LLM
integration in the current code.
