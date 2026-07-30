import { useMemo, useState } from "react";
import { ChevronDown, ListFilter } from "lucide-react";
import { useAnalysis } from "../context/AnalysisContext";
import { classifyStatus, severityStyle } from "../config/theme";

const PAGE_SIZE = 10;

const LogsTable = () => {
  const { analysisResult } = useAnalysis();
  const [visible, setVisible] = useState(PAGE_SIZE);

  const logs = useMemo(
    () =>
      (analysisResult?.anomalies || []).map((log, index) => ({
        id: index + 1,
        ip: log.ip,
        statusCode: log.status_code,
        frequency: log.ip_frequency,
        reason: log.reason,
        raw: log.raw,
        ...classifyStatus(log.status_code),
      })),
    [analysisResult]
  );

  const rows = logs.slice(0, visible);

  return (
    <section className="surface mt-6 p-6">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 className="heading text-base">Suspicious entries</h2>
          <p className="mt-1 text-sm text-slate-400">
            Individual log lines the engine flagged
          </p>
        </div>
        <span className="chip border-white/10 bg-white/[0.04] text-slate-300">
          <ListFilter className="h-3.5 w-3.5" />
          {logs.length.toLocaleString()} shown
        </span>
      </div>

      {logs.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-500">
          Nothing suspicious in this log — every entry looked normal.
        </p>
      ) : (
        <>
          <div className="-mx-2 overflow-x-auto px-2">
            <table className="w-full min-w-[640px] text-sm">
              <caption className="sr-only">
                Log entries flagged as anomalous, with source IP, event type and
                severity
              </caption>
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th scope="col" className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-slate-500">#</th>
                  <th scope="col" className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-slate-500">IP address</th>
                  <th scope="col" className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-slate-500">Event</th>
                  <th scope="col" className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
                  <th scope="col" className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-slate-500">Severity</th>
                  <th scope="col" className="pb-3 text-xs font-medium uppercase tracking-wider text-slate-500">Why</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((log) => {
                  const tone = severityStyle(log.severity);
                  return (
                    <tr
                      key={log.id}
                      className="border-b border-white/5 transition hover:bg-white/[0.03]"
                    >
                      <td className="py-3 pr-4 text-slate-600">{log.id}</td>
                      <td className="py-3 pr-4 font-mono text-xs text-violet-300">
                        {log.ip}
                      </td>
                      <td className="py-3 pr-4 text-slate-300">{log.event}</td>
                      <td className="py-3 pr-4 font-mono text-xs text-slate-400">
                        {log.statusCode}
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`chip ${tone.chip}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
                          {log.severity}
                        </span>
                      </td>
                      <td className="py-3 text-xs text-slate-500">
                        {log.reason ||
                          (log.frequency > 1
                            ? `${log.frequency} requests from this IP`
                            : "—")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {visible < logs.length && (
            <button
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="btn-ghost mx-auto mt-5 flex px-4 py-2 text-xs"
            >
              <ChevronDown className="h-3.5 w-3.5" />
              Show {Math.min(PAGE_SIZE, logs.length - visible)} more
            </button>
          )}

          {analysisResult?.truncated && visible >= logs.length && (
            <p className="mt-5 text-center text-xs text-slate-500">
              Only the first {logs.length.toLocaleString()} detections are shown.
            </p>
          )}
        </>
      )}
    </section>
  );
};

export default LogsTable;
