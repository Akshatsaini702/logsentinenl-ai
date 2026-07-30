const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const fsp = require("fs/promises");
const Alert = require("../models/Alert");
const { isDatabaseReady } = require("../utils/database");

const ML_SERVICE_URL = (
  process.env.ML_SERVICE_URL || "https://logsentinenl-ml.onrender.com"
).replace(/\/+$/, "");

// Render's free tier puts services to sleep after inactivity. A cold start can
// take well over a minute, so we allow a generous timeout and retry once after
// pinging the root route to wake the instance.
const ML_TIMEOUT_MS = 120000;
const WAKE_TIMEOUT_MS = 150000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const postToMlService = (filePath, originalName) => {
  const formData = new FormData();
  formData.append("file", fs.createReadStream(filePath), originalName);

  return axios.post(`${ML_SERVICE_URL}/analyze`, formData, {
    headers: formData.getHeaders(),
    timeout: ML_TIMEOUT_MS,
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
  });
};

const isColdStartError = (error) => {
  const status = error.response?.status;
  return (
    error.code === "ECONNABORTED" ||
    error.code === "ECONNRESET" ||
    error.code === "ETIMEDOUT" ||
    status === 502 ||
    status === 503 ||
    status === 504
  );
};

const wakeMlService = async () => {
  try {
    await axios.get(`${ML_SERVICE_URL}/`, { timeout: WAKE_TIMEOUT_MS });
    return true;
  } catch (err) {
    return false;
  }
};

const classifyAnomaly = (statusCode) => {
  if (statusCode === 401) {
    return {
      event: "Failed Login Attempt",
      type: "Authentication",
      severity: "High",
      aiAnalysis:
        "Repeated failed login attempts detected. Possible brute force attack.",
    };
  }

  if (statusCode === 403) {
    return {
      event: "Unauthorized Access",
      type: "Security",
      severity: "High",
      aiAnalysis:
        "Access denied events detected. Possible unauthorized access attempt.",
    };
  }

  if (statusCode === 500) {
    return {
      event: "Server Error",
      type: "API",
      severity: "Critical",
      aiAnalysis:
        "Internal server errors detected. Immediate investigation recommended.",
    };
  }

  if (statusCode === 404) {
    return {
      event: "Repeated Not Found",
      type: "API",
      severity: "Medium",
      aiAnalysis:
        "High volume of 404 responses detected. Possible endpoint enumeration.",
    };
  }

  return {
    event: "Suspicious Activity",
    type: "Security",
    severity: "Medium",
    aiAnalysis: "Anomaly detected by the detection engine.",
  };
};

const persistAlerts = async (anomalies) => {
  // Without a live connection mongoose buffers the write until it times out,
  // adding ~10s to every analysis for history we cannot save anyway.
  if (!isDatabaseReady()) return 0;

  const seen = new Set();
  const documents = [];

  for (const anomaly of anomalies) {
    const key = `${anomaly.ip}-${anomaly.status_code}`;
    if (seen.has(key)) continue;
    seen.add(key);

    documents.push({
      ip: anomaly.ip,
      status: "Flagged",
      ...classifyAnomaly(anomaly.status_code),
    });
  }

  if (documents.length === 0) return 0;

  try {
    // ordered:false so one bad document doesn't discard the rest.
    const created = await Alert.insertMany(documents, { ordered: false });
    return created.length;
  } catch (err) {
    // A failure to save history should never fail the analysis itself.
    console.error("ALERT PERSIST ERROR:", err.message);
    return err.insertedDocs?.length || 0;
  }
};

// The engine understood the request but could not read the file as logs. This
// is user-fixable, so explain the expected shape rather than saying "failed".
const unreadableLogResponse = (payload = {}) => {
  const scanned = payload.lines_scanned;

  return {
    error: payload.error || "No valid log entries found",
    detail:
      payload.error === "Uploaded file is empty"
        ? "That file has no content. Export your access log again and retry."
        : `None of the ${scanned ? `${scanned} lines` : "lines"} matched a known log format. ` +
          "Each line needs an IP address and a 3-digit HTTP status code, " +
          'e.g. 45.33.32.156 - - [01/Jun/2025:10:00:01] "POST /login HTTP/1.1" 401 512',
  };
};

const analyzeLogs = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      error: "No file uploaded",
      detail: "Attach a .log or .txt file using the 'file' field.",
    });
  }

  const filePath = req.file.path;

  try {
    let response;

    try {
      response = await postToMlService(filePath, req.file.originalname);
    } catch (error) {
      if (!isColdStartError(error)) throw error;

      // Likely a sleeping free-tier instance - wake it and try once more.
      console.warn("ML service unreachable, attempting wake + retry...");
      await wakeMlService();
      await sleep(2000);
      response = await postToMlService(filePath, req.file.originalname);
    }

    const result = response.data;

    if (result?.error) {
      return res.status(422).json(unreadableLogResponse(result));
    }

    const alertsCreated = await persistAlerts(result.anomalies || []);

    return res.json({ ...result, alerts_created: alertsCreated });
  } catch (error) {
    const status = error.response?.status;
    const mlDetail = error.response?.data?.detail || error.response?.data?.error;

    console.error("ANALYZE ERROR:", mlDetail || error.code || error.message);

    // 422 means the engine ran fine but the file wasn't readable as logs.
    if (status === 422) {
      return res.status(422).json(unreadableLogResponse(error.response.data));
    }

    if (isColdStartError(error)) {
      return res.status(503).json({
        error: "Analysis service is starting up",
        detail:
          "The detection engine was asleep and did not wake in time. Please try again in about a minute.",
      });
    }

    return res.status(status && status < 500 ? status : 500).json({
      error: "Failed to analyze logs",
      detail: mlDetail || error.message,
    });
  } finally {
    // multer writes every upload to disk; remove it so the dyno doesn't fill up.
    fsp.unlink(filePath).catch(() => {});
  }
};

module.exports = {
  analyzeLogs,
};
