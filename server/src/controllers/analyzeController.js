const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const analyzeLogs = async (req, res) => {
  try {
    const formData = new FormData();

    formData.append(
      "file",
      fs.createReadStream(req.file.path),
      req.file.originalname
    );

    const response = await axios.post(
      "http://127.0.0.1:8000/analyze",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      error: "Failed to analyze logs",
    });
  }
};

module.exports = {
  analyzeLogs,
};