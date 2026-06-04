# LogSentinel AI 🚀

### AI-Powered Log Monitoring & Threat Detection Platform

LogSentinel AI is a full-stack cybersecurity monitoring platform that automatically analyzes server logs, detects suspicious activities using Machine Learning and rule-based detection, generates security alerts, and provides downloadable PDF security reports.

The system helps security teams identify threats such as brute-force attacks, unauthorized access attempts, and server-side failures through an intuitive analytics dashboard.

---

## 🌐 Live Demo

**Frontend:**
[https://logsentinenl-ai.vercel.app/](https://logsentinenl-ai.vercel.app/)

**Backend API:**
[https://logsentinenl-ai.onrender.com/](https://logsentinenl-ai.onrender.com/)

**ML Service:**
[https://logsentinenl-ml.onrender.com/](https://logsentinenl-ml.onrender.com/)

---

## 📌 Features

### Log Upload & Analysis

* Upload `.log` files directly through the web interface
* Parse Apache/Nginx-style server logs
* Detect suspicious events automatically
* Process logs in real-time

### AI/ML Threat Detection

* Failed login detection (401 errors)
* Unauthorized access detection (403 errors)
* Server failure detection (500 errors)
* High-frequency IP activity detection
* Rule-based anomaly identification
* Security event classification

### Security Dashboard

* Total logs analyzed
* Anomalies detected
* Suspicious IP tracking
* Error event monitoring
* Dynamic anomaly visualization
* Real-time security metrics

### Alert Management

* Automatic alert generation
* Severity classification
* Threat categorization
* AI-generated security explanations
* MongoDB alert storage

### PDF Security Reports

* Download professional incident reports
* Security summary generation
* Threat statistics
* Alert documentation

---

## 🏗️ System Architecture

```text
User
 │
 ▼
React Frontend (Vercel)
 │
 ▼
Node.js Backend (Render)
 │
 ├── MongoDB Atlas
 │
 └── FastAPI ML Service (Render)
          │
          ▼
     Threat Detection Engine
```

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Recharts
* Axios
* React Router

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* Multer
* PDFKit

### Machine Learning Service

* FastAPI
* Pandas
* NumPy
* Scikit-Learn
* Uvicorn

### Deployment

* Vercel (Frontend)
* Render (Backend & ML Service)
* MongoDB Atlas (Database)

---

## 🔍 Threat Detection Logic

LogSentinel AI currently detects:

### Failed Login Attempts

```text
HTTP 401 Responses
```

Potential brute-force attack activity.

### Unauthorized Access Attempts

```text
HTTP 403 Responses
```

Attempts to access restricted resources.

### Server Errors

```text
HTTP 500 Responses
```

Critical backend failures requiring investigation.

### High Frequency IP Activity

```text
Multiple requests from the same IP
```

Possible scanning, abuse, or automated attack behavior.

---

## 📊 Dashboard Metrics

The dashboard provides:

* Total Log Entries
* Anomalies Detected
* Suspicious IP Count
* Error Event Count
* Anomaly Distribution Graph
* Security Recommendations

---

## 📁 Project Structure

```text
logsentinenl-ai/
│
├── client/          # React Frontend
│
├── server/          # Node.js Backend
│
├── ml-service/      # FastAPI ML Service
│
└── README.md
```

---

## 🚀 Local Installation

### Clone Repository

```bash
git clone https://github.com/Akshatsaini702/logsentinenl-ai.git
cd logsentinenl-ai
```

### Frontend

```bash
cd client
npm install
npm start
```

### Backend

```bash
cd server
npm install
npm run dev
```

### ML Service

```bash
cd ml-service
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## 📷 Screenshots

Add screenshots here:

### Home Page

![Home](screenshots/home.png)

### Dashboard

![Dashboard](screenshots/dashboard.png)

### Alerts Page

![Alerts](screenshots/alerts.png)

### PDF Report

![PDF](screenshots/report.png)

---

## 🎯 Future Improvements

* Advanced ML anomaly detection
* User authentication & RBAC
* SIEM integration
* Real-time WebSocket alerts
* Threat intelligence feeds
* IP reputation scoring
* Cloud log ingestion
* Email/SMS notifications


