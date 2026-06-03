const express = require("express");
const router = express.Router();

const { getAlerts, createAlert, seedAlerts } = require("../controllers/alertController");

router.get("/", getAlerts);
router.post("/", createAlert);
router.post("/seed", seedAlerts);

module.exports = router;