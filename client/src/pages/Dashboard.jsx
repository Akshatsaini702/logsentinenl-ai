import StatsCard from '../components/StatsCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import UploadZone from '../components/UploadZone';

import { useState } from 'react';
import LogsTable from '../components/LogsTable';
import AIRecommendations from '../components/AIRecommendations';

const anomalyData = [
  { time: '00:00', anomalies: 2 },
  { time: '02:00', anomalies: 5 },
  { time: '04:00', anomalies: 1 },
  { time: '06:00', anomalies: 8 },
  { time: '08:00', anomalies: 23 },
  { time: '10:00', anomalies: 14 },
  { time: '12:00', anomalies: 45 },
  { time: '14:00', anomalies: 12 },
  { time: '16:00', anomalies: 38 },
  { time: '18:00', anomalies: 7 },
  { time: '20:00', anomalies: 19 },
  { time: '22:00', anomalies: 3 },
];

const Dashboard = () => {
    const [uploadedFile, setUploadedFile] = useState(null);

const handleFileUpload = (file) => {
  setUploadedFile(file);
  console.log('File uploaded:', file.name);
};
  const stats = [
    { title: "Total Logs", value: "10,482", icon: "📋", color: "blue" },
    { title: "Anomalies Detected", value: "143", icon: "⚠️", color: "yellow" },
    { title: "Critical Alerts", value: "12", icon: "🚨", color: "red" },
    { title: "Normal Entries", value: "10,327", icon: "✅", color: "green" },
  ];

  return (
    <div className="px-8 py-10">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Dashboard</h2>
        <p className="text-gray-400 mt-1">Real-time log monitoring & threat detection</p>
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

      {/* Anomaly Timeline */}
      <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-white font-semibold text-lg mb-6">
          Anomaly Timeline
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={anomalyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="time" stroke="#6b7280" tick={{ fill: '#6b7280' }} />
            <YAxis stroke="#6b7280" tick={{ fill: '#6b7280' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
              itemStyle={{ color: '#a855f7' }}
            />
            <Line type="monotone" dataKey="anomalies" stroke="#1711da" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Upload Zone */}
<div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-6">
  <h3 className="text-white font-semibold text-lg mb-6">
    Upload Log File
  </h3>
  <UploadZone onFileUpload={handleFileUpload} />
  {uploadedFile && (
    <div className="mt-4 bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 flex items-center gap-3">
      <span className="text-purple-400 text-xl">✅</span>
      <div>
        <p className="text-white font-semibold">{uploadedFile.name}</p>
        <p className="text-gray-400 text-sm">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
      </div>
    </div>
  )}
</div>
<LogsTable />
<AIRecommendations />


    </div>
  );
};

export default Dashboard;