import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CircleAlert,
  LoaderCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { api, describeError } from "../config/api";
import { severityStyle } from "../config/theme";

const SEVERITIES = ["All", "Critical", "High", "Medium", "Low"];
const TYPES = ["All", "Authentication", "API", "Network", "Security", "Performance"];

const FilterRow = ({ label, options, value, onChange }) => (
  <div>
    <p className="mb-2.5 text-xs font-medium uppercase tracking-wider text-slate-500">
      {label}
    </p>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          aria-pressed={value === option}
          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
            value === option
              ? "bg-violet-600 text-white shadow shadow-violet-900/40"
              : "border border-white/10 bg-white/[0.04] text-slate-400 hover:border-white/20 hover:text-white"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  </div>
);

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [severityFilter, setSeverityFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [searchIP, setSearchIP] = useState("");
  const [selected, setSelected] = useState(null);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.get("/api/alerts");
      setAlerts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(describeError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  // Close the detail dialog on Escape.
  useEffect(() => {
    if (!selected) return undefined;
    const onKey = (event) => event.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const filtered = useMemo(
    () =>
      alerts.filter((alert) => {
        const matchSeverity =
          severityFilter === "All" || alert.severity === severityFilter;
        const matchType = typeFilter === "All" || alert.type === typeFilter;
        const matchIP =
          searchIP === "" ||
          (alert.ip || "").toLowerCase().includes(searchIP.toLowerCase().trim());
        return matchSeverity && matchType && matchIP;
      }),
    [alerts, severityFilter, typeFilter, searchIP]
  );

  const counts = useMemo(
    () => ({
      total: alerts.length,
      critical: alerts.filter((a) => a.severity === "Critical").length,
      high: alerts.filter((a) => a.severity === "High").length,
      resolved: alerts.filter((a) => a.status === "Resolved").length,
    }),
    [alerts]
  );

  const summaryCards = [
    { label: "Total alerts", value: counts.total, tone: "text-white" },
    { label: "Critical", value: counts.critical, tone: "text-rose-300" },
    { label: "High severity", value: counts.high, tone: "text-orange-300" },
    { label: "Resolved", value: counts.resolved, tone: "text-emerald-300" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Alert centre
          </h1>
          <p className="mt-1.5 text-sm text-slate-400">
            Every threat detected across your uploads
          </p>
        </div>
        <button
          onClick={fetchAlerts}
          disabled={loading}
          className="btn-ghost px-4 py-2 text-xs"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="surface p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              {card.label}
            </p>
            <p className={`mt-3 text-3xl font-semibold tracking-tight ${card.tone}`}>
              {loading ? "—" : card.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="surface mt-6 flex flex-col gap-6 p-6 lg:flex-row lg:gap-10">
        <FilterRow
          label="Severity"
          options={SEVERITIES}
          value={severityFilter}
          onChange={setSeverityFilter}
        />
        <div className="hidden w-px shrink-0 bg-gradient-to-b from-transparent via-white/15 to-transparent lg:block" />
        <FilterRow
          label="Type"
          options={TYPES}
          value={typeFilter}
          onChange={setTypeFilter}
        />
      </div>

      <div className="surface mt-6 p-6">
        <label
          htmlFor="ip-search"
          className="mb-2.5 block text-xs font-medium uppercase tracking-wider text-slate-500"
        >
          Search by IP address
        </label>
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            id="ip-search"
            type="text"
            value={searchIP}
            onChange={(event) => setSearchIP(event.target.value)}
            placeholder="e.g. 45.33.32.156"
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 transition focus:border-violet-500/60 focus:bg-white/[0.06] focus:outline-none"
          />
          {searchIP && (
            <button
              onClick={() => setSearchIP("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="surface mt-6 p-6">
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-16 text-slate-500">
            <LoaderCircle className="h-6 w-6 animate-spin text-violet-400" />
            <p className="text-sm">Loading alerts…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <CircleAlert className="h-7 w-7 text-rose-400" />
            <div>
              <p className="font-medium text-rose-200">{error.title}</p>
              {error.detail && (
                <p className="mx-auto mt-1 max-w-sm text-xs text-rose-200/70">
                  {error.detail}
                </p>
              )}
            </div>
            <button onClick={fetchAlerts} className="btn-ghost mt-1 px-4 py-2 text-xs">
              <RefreshCw className="h-3.5 w-3.5" />
              Try again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <ShieldCheck className="h-7 w-7 text-emerald-400" />
            <p className="text-sm text-slate-400">
              {alerts.length === 0
                ? "No alerts stored yet — analyse a log file to populate this list."
                : "No alerts match the current filters."}
            </p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-slate-500">
              {filtered.length.toLocaleString()} of {alerts.length.toLocaleString()}{" "}
              {alerts.length === 1 ? "alert" : "alerts"}
            </p>

            <div className="-mx-2 overflow-x-auto px-2">
              <table className="w-full min-w-[720px] text-sm">
                <caption className="sr-only">Stored security alerts</caption>
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    {["#", "Detected", "IP address", "Event", "Type", "Severity", "Status", ""].map(
                      (heading, index) => (
                        <th
                          key={heading || index}
                          scope="col"
                          className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-slate-500"
                        >
                          {heading}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((alert, index) => {
                    const tone = severityStyle(alert.severity);
                    return (
                      <tr
                        key={alert._id || index}
                        className="border-b border-white/5 transition hover:bg-white/[0.03]"
                      >
                        <td className="py-3 pr-4 text-slate-600">{index + 1}</td>
                        <td className="py-3 pr-4 font-mono text-xs text-slate-400">
                          {alert.createdAt
                            ? new Date(alert.createdAt).toLocaleString()
                            : "—"}
                        </td>
                        <td className="py-3 pr-4 font-mono text-xs text-violet-300">
                          {alert.ip}
                        </td>
                        <td className="py-3 pr-4 text-slate-300">{alert.event}</td>
                        <td className="py-3 pr-4 text-xs text-slate-500">
                          {alert.type}
                        </td>
                        <td className="py-3 pr-4">
                          <span className={`chip ${tone.chip}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
                            {alert.severity}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-xs text-slate-400">
                          {alert.status}
                        </td>
                        <td className="py-3">
                          <button
                            onClick={() => setSelected(alert)}
                            className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-violet-500/40 hover:text-white"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="alert-detail-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/15 bg-ink-900 p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <h2 id="alert-detail-title" className="heading text-lg">
                Alert details
              </h2>
              <button
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white/5 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <dl className="space-y-4">
              {[
                ["IP address", selected.ip, "font-mono text-violet-300"],
                ["Event", selected.event, "text-white"],
                ["Type", selected.type, "text-white"],
                ["Status", selected.status, "text-white"],
                [
                  "Detected",
                  selected.createdAt
                    ? new Date(selected.createdAt).toLocaleString()
                    : "—",
                  "font-mono text-xs text-slate-300",
                ],
              ].map(([label, value, className]) => (
                <div key={label}>
                  <dt className="text-xs uppercase tracking-wider text-slate-500">
                    {label}
                  </dt>
                  <dd className={`mt-1 ${className}`}>{value || "—"}</dd>
                </div>
              ))}

              <div>
                <dt className="text-xs uppercase tracking-wider text-slate-500">
                  Severity
                </dt>
                <dd className="mt-1.5">
                  <span className={`chip ${severityStyle(selected.severity).chip}`}>
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        severityStyle(selected.severity).dot
                      }`}
                    />
                    {selected.severity}
                  </span>
                </dd>
              </div>
            </dl>

            <div className="mt-5 rounded-xl border border-violet-500/25 bg-violet-500/[0.08] p-4">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-violet-300">
                Analysis
              </p>
              <p className="text-sm leading-relaxed text-slate-300">
                {selected.aiAnalysis || "No additional analysis was recorded."}
              </p>
            </div>

            <button
              onClick={() => setSelected(null)}
              className="btn-ghost mt-5 w-full py-2.5"
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
