const express = require("express");
const cors = require("cors");
const alertRoutes = require("./routes/alertRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("LogSentinel Backend Running");
});

const PORT = 5000;

app.use("/api/alerts", alertRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});