import StatsCard from "../components/StatsCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LogsTable from "../components/LogsTable";
import AIRecommendations from "../components/AIRecommendations";
import { useAnalysis } from "../context/AnalysisContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { analysisResult } = useAnalysis();
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileUpload = (file) => {
    setUploadedFile(file);
    console.log("File uploaded:", file.name);
  };

  const chartData = [
    {
      category: "Failed Login",
      count:
        analysisResult?.anomalies?.filter(
          (a) => a.status_code === 401
        ).length || 0,
    },
    {
      category: "Unauthorized",
      count:
        analysisResult?.anomalies?.filter(
          (a) => a.status_code === 403
        ).length || 0,
    },
    {
      category: "Server Error",
      count:
        analysisResult?.anomalies?.filter(
          (a) => a.status_code === 500
        ).length || 0,
    },
  ];

  const stats = [
    {
      title: "Total Logs",
      value: analysisResult?.total || 0,
      icon: "📋",
      color: "blue",
    },
    {
      title: "Anomalies Detected",
      value: analysisResult?.anomalies_count || 0,
      icon: "⚠️",
      color: "yellow",
    },
    {
      title: "Suspicious IPs",
      value: analysisResult?.summary?.high_frequency_ips?.length || 0,
      icon: "🚨",
      color: "red",
    },
    {
      title: "Error Events",
      value: analysisResult?.summary?.error_count || 0,
      icon: "✅",
      color: "green",
    },
  ];

  return (
    <div className="px-8 py-10">
      <div className="mb-8 flex items-center justify-between">
  <div>
    <h2 className="text-3xl font-bold text-white">
      Dashboard
    </h2>
    <p className="text-gray-400 mt-1">
      Real-time log monitoring & threat detection
    </p>
  </div>

  <div className="flex items-center gap-3">
    <button
      onClick={() =>
        window.open(
          "https://logsentinenl-ai.onrender.com/api/report",
          "_blank"
        )
      }
      className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold transition"
    >
      Download PDF
    </button>

    <button
      onClick={() => navigate("/alerts")}
      className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-semibold transition"
    >
      View Alerts →
    </button>
  </div>
</div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Anomaly Distribution */}
      <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-white font-semibold text-lg mb-6">
          Anomaly Distribution
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1f2937"
            />

            <XAxis
              dataKey="category"
              stroke="#6b7280"
              tick={{ fill: "#6b7280" }}
            />

            <YAxis
              stroke="#6b7280"
              tick={{ fill: "#6b7280" }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #374151",
                borderRadius: "8px",
              }}
            />

            <Bar
              dataKey="count"
              fill="#a855f7"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <LogsTable />
      <AIRecommendations />
    </div>
  );
};

export default Dashboard;