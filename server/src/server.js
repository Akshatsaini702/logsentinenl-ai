const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const alertRoutes = require("./routes/alertRoutes");

dotenv.config();

const app = express();

// Connect Database
connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("LogSentinel Backend Running");
});

const PORT = process.env.PORT || 5000;

app.use("/api/alerts", alertRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});