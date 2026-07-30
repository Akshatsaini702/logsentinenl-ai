const multer = require("multer");
const express = require("express");
const router = express.Router();

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 },
});

const { analyzeLogs } = require("../controllers/analyzeController");

router.post("/", upload.single("file"), analyzeLogs);

module.exports = router;
