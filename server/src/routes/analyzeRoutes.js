const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const express = require("express");
const router = express.Router();


const {
  analyzeLogs,
} = require("../controllers/analyzeController");

router.post("/", upload.single("file"), analyzeLogs);

module.exports = router;