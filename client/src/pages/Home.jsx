import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAnalysis } from '../context/AnalysisContext';

const Home = () => {
  const navigate = useNavigate();
  const { setAnalysisResult } = useAnalysis();
  const [file, setFile] = useState(null);
const [loading, setLoading] = useState(false);
const handleUpload = async () => {
  if (!file) {
    alert("Please select a log file first");
    return;
  }

  try {
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      "http://localhost:5000/api/analyze",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setAnalysisResult(response.data);

    navigate("/dashboard");
  } catch (error) {
    console.error(error);
    alert("Failed to analyze logs");
  } finally {
    setLoading(false);
  }
};
   return (
  <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 px-4">
      <div className="bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs px-4 py-2 rounded-full">
        AI-Powered Log Monitoring Platform
      </div>
      <h1 className="text-5xl font-bold text-white text-center">
        Detect Threats. <span className="text-purple-500">Instantly.</span>
      </h1>
      <p className="text-gray-400 text-lg text-center max-w-lg">
        Upload your server logs — LogSentinel AI detects anomalies, 
        suspicious patterns, and threats in real-time.
      </p>
      <div className="mt-8 flex flex-col items-center gap-4">
 <label className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition">
  Choose Log File
  <input
    type="file"
    accept=".log,.txt"
    onChange={(e) => setFile(e.target.files[0])}
    className="hidden"
  />
</label>

  {file && (
  <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-5 w-full max-w-md">
    <div className="mb-4">
  <p className="text-white font-semibold">
    ✅ {file.name}
  </p>

  <p className="text-gray-400 text-sm">
    {(file.size / 1024).toFixed(2)} KB
  </p>

  <p className="text-green-400 text-sm mt-2">
    Ready for analysis 🚀
  </p>
</div>

    <button
      onClick={handleUpload}
      disabled={loading}
      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition"
    >
      {loading ? (
  <div className="flex items-center justify-center gap-2">
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
    <span>Analyzing Logs...</span>
  </div>
) : (
  "Analyze Logs"
)}
    </button>
  </div>
)}
</div>
     
    </div>
  );
};

export default Home;