const express = require("express");
const multer = require("multer");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("./config/db.js");
const alertRoutes = require("./routes/alertRoutes");
const analyzeRoutes = require("./routes/analyzeRoutes");
const reportRoutes = require("./routes/reportRoutes");

dotenv.config();

const app = express();

// Connect Database (non-fatal - see config/db.js)
connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("LogSentinel Backend Running");
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    uptime: Math.round(process.uptime()),
  });
});

const PORT = process.env.PORT || 5000;

app.use("/api/alerts", alertRoutes);
app.use("/api/analyze", analyzeRoutes);
app.use("/api/report", reportRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Not found", detail: `No route for ${req.method} ${req.originalUrl}` });
});

// Central error handler - without this, multer rejections (file too large, bad
// field name) surfaced as an opaque 500 or crashed the process.
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const detail =
      err.code === "LIMIT_FILE_SIZE"
        ? "That file is larger than the 10 MB limit."
        : err.message;
    return res.status(400).json({ error: "Upload rejected", detail });
  }

  console.error("UNHANDLED ERROR:", err);
  res.status(500).json({ error: "Internal server error", detail: err.message });
});

// A stray rejection used to take the whole dyno down, returning 502s for every
// subsequent request until Render restarted it.
process.on("unhandledRejection", (reason) => {
  console.error("UNHANDLED REJECTION:", reason);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
