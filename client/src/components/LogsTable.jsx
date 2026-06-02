const severityColors = {
  Critical: "bg-red-500/20 text-red-400 border border-red-500/30",
  High: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
  Medium: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  Low: "bg-green-500/20 text-green-400 border border-green-500/30",
};

const dummyLogs = [
  { id: 1, timestamp: "2025-06-01 12:03:21", ip: "45.33.32.156", event: "Failed login attempt", severity: "Critical", status: "Blocked" },
  { id: 2, timestamp: "2025-06-01 12:05:44", ip: "192.168.1.105", event: "Unusual API call pattern", severity: "High", status: "Flagged" },
  { id: 3, timestamp: "2025-06-01 12:11:02", ip: "103.21.244.0", event: "Port scan detected", severity: "High", status: "Flagged" },
  { id: 4, timestamp: "2025-06-01 12:15:33", ip: "10.0.0.42", event: "Repeated 404 errors", severity: "Medium", status: "Monitoring" },
  { id: 5, timestamp: "2025-06-01 12:22:17", ip: "172.16.0.8", event: "Slow response time spike", severity: "Low", status: "Resolved" },
  { id: 6, timestamp: "2025-06-01 12:31:45", ip: "45.33.32.200", event: "Brute force attempt", severity: "Critical", status: "Blocked" },
  { id: 7, timestamp: "2025-06-01 12:44:09", ip: "192.168.1.200", event: "Unauthorized endpoint access", severity: "High", status: "Flagged" },
];

const LogsTable = () => {
  return (
    <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-semibold text-lg">Suspicious Log Entries</h3>
        <span className="text-gray-400 text-sm">{dummyLogs.length} entries detected</span>
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
            {dummyLogs.map((log) => (
              <tr key={log.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                <td className="py-3 pr-4 text-gray-500">{log.id}</td>
                <td className="py-3 pr-4 text-gray-300 font-mono text-xs">{log.timestamp}</td>
                <td className="py-3 pr-4 text-purple-400 font-mono text-xs">{log.ip}</td>
                <td className="py-3 pr-4 text-gray-300">{log.event}</td>
                <td className="py-3 pr-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${severityColors[log.severity]}`}>
                    {log.severity}
                  </span>
                </td>
                <td className="py-3 text-gray-400 text-xs">{log.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogsTable;