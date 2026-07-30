import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowRight,
  Download,
  FileText,
  Gauge,
  Globe,
  ShieldAlert,
  TriangleAlert,
  Upload,
} from "lucide-react";
import StatsCard from "../components/StatsCard";
import LogsTable from "../components/LogsTable";
import AIRecommendations from "../components/AIRecommendations";
import { useAnalysis } from "../context/AnalysisContext";
import { REPORT_URL } from "../config/api";

// Single-series magnitude chart: one hue, identity comes from the axis labels.
const BAR_COLOR = "#8b5cf6";
const BAR_COLOR_MUTED = "#8b5cf655";

const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;

  return (
    <div className="rounded-xl border border-white/15 bg-ink-900/95 px-3 py-2 shadow-xl backdrop-blur">
      <p className="text-sm font-medium text-white">{point.category}</p>
      <p className="mt-0.5 text-xs text-slate-400">
        {point.count.toLocaleString()}{" "}
        {point.count === 1 ? "detection" : "detections"}
      </p>
      {point.code !== "other" && (
        <p className="mt-1 font-mono text-[11px] text-slate-500">
          HTTP {point.code}
        </p>
      )}
    </div>
  );
};

const EmptyState = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="surface mx-auto max-w-md p-10 text-center">
        <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15 ring-1 ring-violet-500/25">
          <FileText className="h-6 w-6 text-violet-300" />
        </span>
        <h2 className="heading text-xl">No analysis yet</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Upload a server log and the dashboard will fill with detected threats,
          suspicious IPs and recommended actions.
        </p>
        <button onClick={() => navigate("/")} className="btn-primary mt-6">
          <Upload className="h-4 w-4" />
          Upload a log file
        </button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { analysisResult, fileName } = useAnalysis();

  const chartData = useMemo(() => {
    if (!analysisResult) return [];

    const anomalies = analysisResult.anomalies || [];
    // Prefer the server-side breakdown (counts every anomaly, not just the
    // returned page); fall back to counting locally for older responses.
    const breakdown =
      analysisResult.summary?.status_breakdown ||
      anomalies.reduce((acc, a) => {
        acc[a.status_code] = (acc[a.status_code] || 0) + 1;
        return acc;
      }, {});

    const labelled = [
      { code: "401", category: "Failed login" },
      { code: "403", category: "Unauthorized" },
      { code: "500", category: "Server error" },
      { code: "404", category: "Not found" },
    ];

    const known = new Set(labelled.map((entry) => entry.code));
    const otherCount = Object.entries(breakdown)
      .filter(([code]) => !known.has(code))
      .reduce((sum, [, count]) => sum + count, 0);

    const rows = labelled
      .map((entry) => ({ ...entry, count: breakdown[entry.code] || 0 }))
      .filter((entry) => entry.count > 0);

    if (otherCount > 0) {
      rows.push({ code: "other", category: "Other", count: otherCount });
    }

    return rows.sort((a, b) => b.count - a.count);
  }, [analysisResult]);

  if (!analysisResult) return <EmptyState />;

  const totalLogs = analysisResult.total || 0;
  const anomalyCount = analysisResult.anomalies_count || 0;
  const suspiciousIPs = analysisResult.summary?.high_frequency_ips?.length || 0;
  const errorCount = analysisResult.summary?.error_count || 0;
  const cleanRate =
    totalLogs > 0
      ? `${Math.round(((totalLogs - anomalyCount) / totalLogs) * 100)}% clean`
      : null;

  const stats = [
    {
      title: "Total logs",
      value: totalLogs,
      hint: cleanRate,
      icon: Gauge,
      color: "sky",
    },
    {
      title: "Anomalies",
      value: anomalyCount,
      hint: anomalyCount > 0 ? "needs review" : "nothing flagged",
      icon: TriangleAlert,
      color: anomalyCount > 0 ? "amber" : "emerald",
    },
    {
      title: "Suspicious IPs",
      value: suspiciousIPs,
      hint: suspiciousIPs > 0 ? "distinct sources" : "none identified",
      icon: Globe,
      color: suspiciousIPs > 0 ? "rose" : "emerald",
    },
    {
      title: "Error events",
      value: errorCount,
      hint: "4xx and 5xx responses",
      icon: ShieldAlert,
      color: errorCount > 0 ? "violet" : "emerald",
    },
  ];

  const maxCount = Math.max(...chartData.map((d) => d.count), 0);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1.5 text-sm text-slate-400">
            {fileName ? (
              <>
                Results for{" "}
                <span className="font-mono text-slate-300">{fileName}</span>
              </>
            ) : (
              "Threat detection results"
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href={REPORT_URL}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
          >
            <Download className="h-4 w-4" />
            PDF report
          </a>
          <button onClick={() => navigate("/alerts")} className="btn-primary">
            View alerts
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatsCard key={stat.title} {...stat} delay={index * 70} />
        ))}
      </div>

      <section className="surface mt-6 p-6">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2 className="heading text-base">Detections by type</h2>
            <p className="mt-1 text-sm text-slate-400">
              How the {anomalyCount.toLocaleString()} flagged{" "}
              {anomalyCount === 1 ? "entry breaks" : "entries break"} down
            </p>
          </div>
        </div>

        {chartData.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-500">
            No anomalies were detected in this log.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 8, bottom: 4, left: -18 }}
              barCategoryGap="28%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#ffffff"
                strokeOpacity={0.06}
                vertical={false}
              />
              <XAxis
                dataKey="category"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                dy={6}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                width={48}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ fill: "#ffffff", fillOpacity: 0.04 }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={56}>
                {chartData.map((entry) => (
                  <Cell
                    key={entry.code}
                    // Emphasis, not identity - the peak reads first.
                    fill={entry.count === maxCount ? BAR_COLOR : BAR_COLOR_MUTED}
                  />
                ))}
                <LabelList
                  dataKey="count"
                  position="top"
                  offset={8}
                  fill="#cbd5e1"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </section>

      <LogsTable />
      <AIRecommendations />
    </div>
  );
};

export default Dashboard;
