const PDFDocument = require("pdfkit");
const Alert = require("../models/Alert");
const { isDatabaseReady, databaseUnavailable } = require("../utils/database");

const generateReport = async (req, res) => {
  // The report is built entirely from stored alerts, so there is nothing to
  // render without a database connection.
  if (!isDatabaseReady()) return databaseUnavailable(res);

  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });

    const criticalAlerts = alerts.filter(
      (a) => a.severity === "Critical"
    ).length;

    const highAlerts = alerts.filter(
      (a) => a.severity === "High"
    ).length;

    const doc = new PDFDocument();

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=LogSentinel_Report.pdf"
    );

    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    doc.fontSize(24).text("LogSentinel AI Security Report", {
      align: "center",
    });

    doc.moveDown();

    doc.fontSize(14).text(
      `Generated On: ${new Date().toLocaleString()}`
    );

    doc.moveDown();

    doc.fontSize(18).text("Summary");

    doc.fontSize(12).text(`Total Alerts: ${alerts.length}`);
    doc.text(`Critical Alerts: ${criticalAlerts}`);
    doc.text(`High Severity Alerts: ${highAlerts}`);

    doc.moveDown();

    doc.fontSize(18).text("Recent Alerts");

    alerts.slice(0, 10).forEach((alert, index) => {
      doc.fontSize(12).text(
        `${index + 1}. ${alert.event} | ${alert.ip} | ${alert.severity}`
      );
    });

    doc.moveDown();

    doc.fontSize(18).text("AI Recommendations");

    doc.fontSize(12).text(
      "- Review failed login attempts."
    );

    doc.text(
      "- Investigate unauthorized access attempts."
    );

    doc.text(
      "- Monitor recurring server errors."
    );

    doc.text(
      "- Enable real-time threat monitoring."
    );

    doc.end();
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to generate report",
    });
  }
};

module.exports = {
  generateReport,
};