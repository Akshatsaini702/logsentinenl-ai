import { useMemo } from "react";
import { Ban, Eye, Search, Sparkles, TriangleAlert } from "lucide-react";
import { useAnalysis } from "../context/AnalysisContext";
import { severityStyle } from "../config/theme";

const AIRecommendations = () => {
  const { analysisResult } = useAnalysis();

  const recommendations = useMemo(() => {
    if (!analysisResult) return [];

    const list = [];
    const summary = analysisResult.summary || {};
    const breakdown = summary.status_breakdown || {};
    const failedLogins = breakdown["401"] || 0;
    const suspiciousIPs = summary.high_frequency_ips || [];

    if (failedLogins > 0) {
      list.push({
        id: "brute-force",
        severity: "Critical",
        icon: Ban,
        title: "Possible brute-force attempt",
        body: `${failedLogins.toLocaleString()} failed authentication ${
          failedLogins === 1 ? "response was" : "responses were"
        } detected.`,
        action:
          "Rate-limit the login endpoint and temporarily block the offending IPs.",
      });
    }

    if (suspiciousIPs.length > 0) {
      list.push({
        id: "frequency",
        severity: "High",
        icon: TriangleAlert,
        title: "Abnormal traffic volume",
        body: `${suspiciousIPs.length} IP ${
          suspiciousIPs.length === 1 ? "address" : "addresses"
        } generated unusual request patterns.`,
        action: `Review traffic from ${suspiciousIPs.slice(0, 3).join(", ")}${
          suspiciousIPs.length > 3 ? " and others" : ""
        }.`,
      });
    }

    if (analysisResult.anomalies_count > 0) {
      list.push({
        id: "review",
        severity: "Medium",
        icon: Search,
        title: "Anomalies need triage",
        body: `${analysisResult.anomalies_count.toLocaleString()} ${
          analysisResult.anomalies_count === 1 ? "entry was" : "entries were"
        } flagged for review.`,
        action:
          "Confirm which detections are genuine threats and which are expected traffic.",
      });
    }

    list.push({
      id: "coverage",
      severity: "Low",
      icon: Eye,
      title: "Improve monitoring coverage",
      body: "Continuous collection catches threats that a one-off upload misses.",
      action:
        "Ship logs on a schedule and enable alerting so detections surface automatically.",
    });

    return list;
  }, [analysisResult]);

  if (recommendations.length === 0) return null;

  return (
    <section className="surface mt-6 p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 ring-1 ring-violet-500/25">
          <Sparkles className="h-4 w-4 text-violet-300" />
        </span>
        <div>
          <h2 className="heading text-base">Recommended actions</h2>
          <p className="mt-0.5 text-sm text-slate-400">
            Prioritised by severity
          </p>
        </div>
      </div>

      <ul className="flex flex-col gap-3">
        {recommendations.map(({ id, severity, icon: Icon, title, body, action }) => {
          const tone = severityStyle(severity);

          return (
            <li
              key={id}
              className="rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-white/20 hover:bg-white/[0.04]"
            >
              <div className="flex items-start gap-3.5">
                <span className={`mt-0.5 rounded-lg p-2 ${tone.chip}`}>
                  <Icon className="h-4 w-4" />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="font-medium text-white">{title}</h3>
                    <span className={`chip ${tone.chip}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
                      {severity}
                    </span>
                  </div>

                  <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                    {body}
                  </p>

                  <p className="mt-2.5 text-sm leading-relaxed text-slate-300">
                    <span className="font-medium text-violet-300">Do this: </span>
                    {action}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default AIRecommendations;
