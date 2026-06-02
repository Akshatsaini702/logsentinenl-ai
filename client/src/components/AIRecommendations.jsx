const recommendations = [
  {
    id: 1,
    type: "Critical",
    title: "Brute Force Attack Detected",
    description: "IP 45.33.32.156 made 47 failed login attempts in 2 minutes. Immediate action required.",
    action: "Block IP 45.33.32.156 and implement rate limiting on /api/login endpoint.",
    icon: "🚨",
    color: "red",
  },
  {
    id: 2,
    type: "High",
    title: "Unusual API Traffic Pattern",
    description: "/api/data endpoint received 1,200 requests in 30 seconds from 3 different IPs.",
    action: "Implement request throttling. Consider adding CAPTCHA for suspicious IPs.",
    icon: "⚠️",
    color: "orange",
  },
  {
    id: 3,
    type: "Medium",
    title: "Port Scan Activity",
    description: "Sequential port scanning detected from IP 103.21.244.0 between 12:10-12:12.",
    action: "Add firewall rule to block IP. Enable port scan detection alerts.",
    icon: "🔍",
    color: "yellow",
  },
  {
    id: 4,
    type: "Suggestion",
    title: "Database Query Optimization",
    description: "Average DB response time increased by 340ms in last hour. Possible missing indexes.",
    action: "Review slow query logs. Add indexes on frequently queried fields.",
    icon: "💡",
    color: "blue",
  },
];

const colorMap = {
  red: "border-red-500/30 bg-red-500/5",
  orange: "border-orange-500/30 bg-orange-500/5",
  yellow: "border-yellow-500/30 bg-yellow-500/5",
  blue: "border-blue-500/30 bg-blue-500/5",
};

const badgeMap = {
  red: "bg-red-500/20 text-red-400",
  orange: "bg-orange-500/20 text-orange-400",
  yellow: "bg-yellow-500/20 text-yellow-400",
  blue: "bg-blue-500/20 text-blue-400",
};

const AIRecommendations = () => {
  return (
    <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">🤖</span>
        <div>
          <h3 className="text-white font-semibold text-lg">AI Recommendations</h3>
          <p className="text-gray-400 text-sm">Powered by Claude AI</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className={`border rounded-xl p-5 ${colorMap[rec.color]} transition hover:scale-[1.01]`}
          >
            <div className="flex items-start gap-4">
              <span className="text-2xl">{rec.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badgeMap[rec.color]}`}>
                    {rec.type}
                  </span>
                  <h4 className="text-white font-semibold">{rec.title}</h4>
                </div>
                <p className="text-gray-400 text-sm mb-3">{rec.description}</p>
                <div className="bg-gray-900/60 rounded-lg p-3">
                  <p className="text-gray-300 text-sm">
                    <span className="text-purple-400 font-semibold">Recommended Action: </span>
                    {rec.action}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIRecommendations;