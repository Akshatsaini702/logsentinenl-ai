import { useAnalysis } from "../context/AnalysisContext";

const severityColors = {
  Critical: "bg-red-500/20 text-red-400 border border-red-500/30",
  High: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
  Medium: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  Low: "bg-green-500/20 text-green-400 border border-green-500/30",
};

const LogsTable = () => {
  const { analysisResult } = useAnalysis();

  const logs =
    analysisResult?.anomalies?.map((log, index) => ({
      id: index + 1,
      timestamp: "Detected Now",
      ip: log.ip,
      event:
        log.status_code === 401
          ? "Failed Login Attempt"
          : log.status_code === 403
          ? "Unauthorized Access"
          : log.status_code === 500
          ? "Server Error"
          : "Suspicious Activity",
      severity:
        log.status_code === 500
          ? "Critical"
          : log.status_code === 403
          ? "High"
          : "Medium",
      status: "Flagged",
    })) || [];

  return (
    <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-semibold text-lg">
          Suspicious Log Entries
        </h3>
        <span className="text-gray-400 text-sm">
          {logs.length} entries detected
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left text-gray-400 pb-3 pr-4">#</th>
              <th className="text-left text-gray-400 pb-3 pr-4">Timestamp</th>
              <th className="text-left text-gray-400 pb-3 pr-4">IP Address</th>
              <th className="text-left text-gray-400 pb-3 pr-4">Event</th>
              <th className="text-left text-gray-400 pb-3 pr-4">Severity</th>
              <th className="text-left text-gray-400 pb-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                className="border-b border-gray-800/50 hover:bg-gray-800/30 transition"
              >
                <td className="py-3 pr-4 text-gray-500">{log.id}</td>
                <td className="py-3 pr-4 text-gray-300">
                  {log.timestamp}
                </td>
                <td className="py-3 pr-4 text-purple-400">
                  {log.ip}
                </td>
                <td className="py-3 pr-4 text-gray-300">
                  {log.event}
                </td>
                <td className="py-3 pr-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${severityColors[log.severity]}`}
                  >
                    {log.severity}
                  </span>
                </td>
                <td className="py-3 text-gray-400">
                  {log.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogsTable;