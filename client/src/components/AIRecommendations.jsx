import { useAnalysis } from "../context/AnalysisContext";

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
  const { analysisResult } = useAnalysis();

  const recommendations = [];

  if (analysisResult?.summary?.error_count > 0) {
    recommendations.push({
      id: 1,
      type: "Critical",
      title: "Suspicious Error Activity Detected",
      description: `${analysisResult.summary.error_count} suspicious error events were detected in uploaded logs.`,
      action:
        "Review affected endpoints and investigate unusual request patterns.",
      icon: "🚨",
      color: "red",
    });
  }

  if (analysisResult?.summary?.high_frequency_ips?.length > 0) {
    recommendations.push({
      id: 2,
      type: "High",
      title: "High Frequency IP Activity",
      description: `${analysisResult.summary.high_frequency_ips.length} IP addresses generated abnormal traffic patterns.`,
      action:
        "Monitor these IPs and consider rate limiting or temporary blocking.",
      icon: "⚠️",
      color: "orange",
    });
  }

  if (analysisResult?.anomalies_count > 0) {
    recommendations.push({
      id: 3,
      type: "Medium",
      title: "Anomalies Found",
      description: `${analysisResult.anomalies_count} anomalies were detected by the ML engine.`,
      action:
        "Review anomaly logs and validate whether they represent real threats.",
      icon: "🔍",
      color: "yellow",
    });
  }

  recommendations.push({
    id: 4,
    type: "Suggestion",
    title: "Improve Monitoring Coverage",
    description:
      "Enable automated alerting and long-term anomaly tracking.",
    action:
      "Store anomaly history in MongoDB and create notification workflows.",
    icon: "💡",
    color: "blue",
  });

  return (
    <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">🤖</span>
        <div>
          <h3 className="text-white font-semibold text-lg">
            AI Recommendations
          </h3>
          <p className="text-gray-400 text-sm">Powered by LogSentinel AI</p>
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
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${badgeMap[rec.color]}`}
                  >
                    {rec.type}
                  </span>

                  <h4 className="text-white font-semibold">
                    {rec.title}
                  </h4>
                </div>

                <p className="text-gray-400 text-sm mb-3">
                  {rec.description}
                </p>

                <div className="bg-gray-900/60 rounded-lg p-3">
                  <p className="text-gray-300 text-sm">
                    <span className="text-purple-400 font-semibold">
                      Recommended Action:
                    </span>{" "}
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