const Alert = require('../models/Alert');
const { isDatabaseReady, databaseUnavailable } = require('../utils/database');

// Get all alerts
const getAlerts = async (req, res) => {
  if (!isDatabaseReady()) return databaseUnavailable(res);

  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });

    res.json(alerts);
  } catch (error) {
    res.status(500).json({
      error: 'Could not load alerts',
      detail: error.message,
    });
  }
};

// Create alert
const createAlert = async (req, res) => {
  if (!isDatabaseReady()) return databaseUnavailable(res);

  try {
    const alert = new Alert(req.body);
    const savedAlert = await alert.save();
    res.status(201).json(savedAlert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Seed dummy alerts
const seedAlerts = async (req, res) => {
  if (!isDatabaseReady()) return databaseUnavailable(res);

  try {
    await Alert.deleteMany({});
    const dummyAlerts = [
      { ip: "45.33.32.156", event: "Failed login attempt", type: "Authentication", severity: "Critical", status: "Blocked", aiAnalysis: "Multiple failed login attempts from same IP — possible brute force attack." },
      { ip: "192.168.1.105", event: "Unusual API call pattern", type: "API", severity: "High", status: "Flagged", aiAnalysis: "Abnormal API request frequency detected — possible scraping attempt." },
      { ip: "103.21.244.0", event: "Port scan detected", type: "Network", severity: "High", status: "Flagged", aiAnalysis: "Sequential port scanning detected — reconnaissance activity suspected." },
      { ip: "10.0.0.42", event: "Repeated 404 errors", type: "API", severity: "Medium", status: "Monitoring", aiAnalysis: "High frequency of 404 errors — possible endpoint enumeration." },
      { ip: "172.16.0.8", event: "Slow response time spike", type: "Performance", severity: "Low", status: "Resolved", aiAnalysis: "Response time exceeded threshold — likely due to high server load." },
      { ip: "45.33.32.200", event: "Brute force attempt", type: "Authentication", severity: "Critical", status: "Blocked", aiAnalysis: "500+ login attempts in 2 minutes — automated brute force tool detected." },
      { ip: "192.168.1.200", event: "Unauthorized endpoint access", type: "Security", severity: "High", status: "Flagged", aiAnalysis: "Access attempt to restricted endpoint without valid token." },
    ];
    await Alert.insertMany(dummyAlerts);
    res.json({ message: 'Alerts seeded successfully', count: dummyAlerts.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAlerts, createAlert, seedAlerts };