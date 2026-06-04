const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const Alert = require("../models/Alert");
const analyzeLogs = async (req, res) => {
  try {
    const formData = new FormData();

    formData.append(
      "file",
      fs.createReadStream(req.file.path),
      req.file.originalname
    );

    const response = await axios.post(
  "http://127.0.0.1:8000/analyze",
  formData,
  {
    headers: formData.getHeaders(),
  }
);

const result = response.data;
console.log("ML RESULT:");
console.log(result);
const processedIPs = new Set();
// Create alerts from anomalies
for (const anomaly of result.anomalies || []) {
  const key = `${anomaly.ip}-${anomaly.status_code}`;

  if (processedIPs.has(key)) {
    continue;
  }

  processedIPs.add(key);
  let event = "Suspicious Activity";
  let type = "Security";
  let severity = "Medium";
  let aiAnalysis = "Anomaly detected by ML engine.";

  if (anomaly.status_code === 401) {
    event = "Failed Login Attempt";
    type = "Authentication";
    severity = "High";
    aiAnalysis =
      "Repeated failed login attempts detected. Possible brute force attack.";
  }

  if (anomaly.status_code === 403) {
    event = "Unauthorized Access";
    type = "Security";
    severity = "High";
    aiAnalysis =
      "Access denied events detected. Possible unauthorized access attempt.";
  }

  if (anomaly.status_code === 500) {
    event = "Server Error";
    type = "API";
    severity = "Critical";
    aiAnalysis =
      "Internal server errors detected. Immediate investigation recommended.";
  }

 try {
  await Alert.create({
    ip: anomaly.ip,
    event,
    type,
    severity,
    status: "Flagged",
    aiAnalysis,
  });
} catch (err) {
  console.error("ALERT CREATE ERROR:", err);
}
}

res.json(result);
  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      error: "Failed to analyze logs",
    });
  }
};

module.exports = {
  analyzeLogs,
};