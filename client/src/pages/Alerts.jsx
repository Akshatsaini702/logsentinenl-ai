import { useState } from 'react';


const allAlerts = [
  { id: 1, timestamp: "2025-06-01 12:03:21", ip: "45.33.32.156", event: "Brute force attack", severity: "Critical", type: "Authentication", status: "Blocked" },
  { id: 2, timestamp: "2025-06-01 12:05:44", ip: "192.168.1.105", event: "Unusual API call pattern", severity: "High", type: "API", status: "Flagged" },
  { id: 3, timestamp: "2025-06-01 12:11:02", ip: "103.21.244.0", event: "Port scan detected", severity: "High", type: "Network", status: "Flagged" },
  { id: 4, timestamp: "2025-06-01 12:15:33", ip: "10.0.0.42", event: "Repeated 404 errors", severity: "Medium", type: "API", status: "Monitoring" },
  { id: 5, timestamp: "2025-06-01 12:22:17", ip: "172.16.0.8", event: "Slow response time spike", severity: "Low", type: "Performance", status: "Resolved" },
  { id: 6, timestamp: "2025-06-01 13:01:45", ip: "45.33.32.200", event: "SQL injection attempt", severity: "Critical", type: "Security", status: "Blocked" },
  { id: 7, timestamp: "2025-06-01 13:15:09", ip: "192.168.1.200", event: "Unauthorized endpoint access", severity: "High", type: "Authentication", status: "Flagged" },
  { id: 8, timestamp: "2025-06-01 13:44:22", ip: "10.0.0.88", event: "Memory usage spike", severity: "Medium", type: "Performance", status: "Monitoring" },
  { id: 9, timestamp: "2025-06-01 14:02:11", ip: "172.16.0.55", event: "Outdated SSL certificate", severity: "Low", type: "Security", status: "Resolved" },
  { id: 10, timestamp: "2025-06-01 14:30:00", ip: "45.33.32.99", event: "DDoS attempt detected", severity: "Critical", type: "Network", status: "Blocked" },
];

const severityColors = {
  Critical: "bg-red-500/20 text-red-400 border border-red-500/30",
  High: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
  Medium: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  Low: "bg-green-500/20 text-green-400 border border-green-500/30",
};

const Alerts = () => {
  const [severityFilter, setSeverityFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [searchIP, setSearchIP] = useState("");
  const [selectedAlert, setSelectedAlert] = useState(null);

  const severities = ["All", "Critical", "High", "Medium", "Low"];
  const types = ["All", "Authentication", "API", "Network", "Security", "Performance"];
  const filtered = allAlerts.filter((a) => {
  const matchSeverity =
    severityFilter === "All" ||
    a.severity === severityFilter;

  const matchType =
    typeFilter === "All" ||
    a.type === typeFilter;

  const matchIP =
    searchIP === "" ||
    a.ip.toLowerCase().includes(searchIP.toLowerCase());

  return matchSeverity && matchType && matchIP;
});


  return (
    <div className="px-8 py-10">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Alert Center</h2>
        <p className="text-gray-400 mt-1">All detected threats in one place</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

  <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
    <p className="text-gray-400 text-sm">Total Alerts</p>
    <h3 className="text-3xl font-bold text-white mt-2">10</h3>
  </div>

  <div className="bg-gray-900 border border-red-500/20 rounded-xl p-5">
    <p className="text-red-400 text-sm">Critical Alerts</p>
    <h3 className="text-3xl font-bold text-red-400 mt-2">3</h3>
  </div>

  <div className="bg-gray-900 border border-orange-500/20 rounded-xl p-5">
    <p className="text-orange-400 text-sm">High Severity</p>
    <h3 className="text-3xl font-bold text-orange-400 mt-2">3</h3>
  </div>

  <div className="bg-gray-900 border border-green-500/20 rounded-xl p-5">
    <p className="text-green-400 text-sm">Resolved</p>
    <h3 className="text-3xl font-bold text-green-400 mt-2">2</h3>
  </div>

</div>


      {/* Filters */}
<div className="flex flex-wrap items-start gap-8 mb-8 bg-gray-900 border border-gray-800 rounded-xl p-6">

  {/* Severity Filter */}
  <div>
    <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">
      Filter by Severity
    </p>

    <div className="flex flex-wrap gap-2">
      {severities.map((s) => (
        <button
          key={s}
          onClick={() => setSeverityFilter(s)}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
            severityFilter === s
              ? "bg-purple-600 text-white"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  </div>

  {/* Divider */}
  <div className="hidden md:flex items-center justify-center">
    <div className="w-px h-24 bg-gradient-to-b from-transparent via-purple-500/60 to-transparent"></div>
  </div>

  {/* Type Filter */}
  <div>
    <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">
      Filter by Type
    </p>

    <div className="flex flex-wrap gap-2">
      {types.map((t) => (
        <button
          key={t}
          onClick={() => setTypeFilter(t)}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
            typeFilter === t
              ? "bg-purple-600 text-white"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  </div>

</div>
<div className="mb-8 bg-gray-900 border border-gray-800 rounded-xl p-6">
  <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">
    Search by IP Address
  </p>

  <input
    type="text"
    placeholder="Search IP... e.g. 45.33.32.156"
    value={searchIP}
    onChange={(e) => setSearchIP(e.target.value)}
    className="w-full md:w-96 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
  />
</div>


      {/* Alerts Count */}
      <p className="text-gray-400 text-sm mb-4">{filtered.length} alerts found</p>

      {/* Alerts Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-gray-400 pb-3 pr-4">#</th>
                <th className="text-left text-gray-400 pb-3 pr-4">Timestamp</th>
                <th className="text-left text-gray-400 pb-3 pr-4">IP Address</th>
                <th className="text-left text-gray-400 pb-3 pr-4">Event</th>
                <th className="text-left text-gray-400 pb-3 pr-4">Type</th>
                <th className="text-left text-gray-400 pb-3 pr-4">Severity</th>
                <th className="text-left text-gray-400 pb-3">Status</th>
                <th className="text-left text-gray-400 pb-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((alert) => (
                <tr key={alert.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                  <td className="py-3 pr-4 text-gray-500">{alert.id}</td>
                  <td className="py-3 pr-4 text-gray-300 font-mono text-xs">{alert.timestamp}</td>
                  <td className="py-3 pr-4 text-purple-400 font-mono text-xs">{alert.ip}</td>
                  <td className="py-3 pr-4 text-gray-300">{alert.event}</td>
                  <td className="py-3 pr-4 text-gray-400 text-xs">{alert.type}</td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${severityColors[alert.severity]}`}>
                      {alert.severity}
                    </span>
                  </td>
                  <td className="py-3 text-gray-400 text-xs">
  {alert.status}
</td>

<td className="py-3">
  <button
  onClick={() => setSelectedAlert(alert)}
  className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded-lg text-xs font-semibold transition">
  View
</button>
</td>
                
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedAlert && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-[500px]">

      <h2 className="text-2xl font-bold mb-6">
        Alert Details
      </h2>

      <div className="space-y-4">

        <div>
          <p className="text-gray-400 text-sm">Alert ID</p>
          <p className="text-white">{selectedAlert.id}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">IP Address</p>
          <p className="text-purple-400">{selectedAlert.ip}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Event</p>
          <p className="text-white">{selectedAlert.event}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Severity</p>
          <p className="text-white">{selectedAlert.severity}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Type</p>
          <p className="text-white">{selectedAlert.type}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Status</p>
          <p className="text-white">{selectedAlert.status}</p>
        </div>

        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
          <p className="text-purple-400 font-semibold mb-2">
            AI Analysis
          </p>

          <p className="text-gray-300 text-sm">
           {selectedAlert.severity === "Critical"
  ? "Critical threat detected. Immediate action recommended."
  : selectedAlert.severity === "High"
  ? "Suspicious activity detected. Review required."
  : selectedAlert.severity === "Medium"
  ? "Moderate anomaly detected. Monitor closely."
  : "Low risk event detected."}
          </p>
        </div>

      </div>

      <button
        onClick={() => setSelectedAlert(null)}
        className="mt-6 w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg"
      >
        Close
      </button>

    </div>
  </div>
)}
    </div>
  );
};

export default Alerts;