const getAlerts = (req, res) => {
  res.json([
    {
      id: 1,
      timestamp: "2025-06-01 12:03:21",
      ip: "45.33.32.156",
      event: "Brute force attack",
      severity: "Critical",
      type: "Authentication",
      status: "Blocked",
    },
    {
      id: 2,
      timestamp: "2025-06-01 12:05:44",
      ip: "192.168.1.105",
      event: "Unusual API call pattern",
      severity: "High",
      type: "API",
      status: "Flagged",
    },
    {
      id: 3,
      timestamp: "2025-06-01 12:11:02",
      ip: "103.21.244.0",
      event: "Port scan detected",
      severity: "High",
      type: "Network",
      status: "Flagged",
    }
  ]);
};

module.exports = {
  getAlerts,
};