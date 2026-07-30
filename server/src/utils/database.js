const mongoose = require("mongoose");

// 1 === connected. Anything else means queries would sit in mongoose's buffer
// until they time out, so callers should bail out early with a clear message.
const isDatabaseReady = () => mongoose.connection.readyState === 1;

const databaseUnavailable = (res) =>
  res.status(503).json({
    error: "Alert history is unavailable",
    detail:
      "The database is not connected right now. Log analysis still works — only saved alerts are affected.",
  });

module.exports = { isDatabaseReady, databaseUnavailable };
