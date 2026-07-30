// Tailwind scans source files for complete class strings, so every class must
// appear literally. Building them with template literals (`text-${color}-500`)
// silently produces no CSS - that is why the old stat cards had no colour.

export const severityStyles = {
  Critical: {
    chip: "border-rose-500/30 bg-rose-500/15 text-rose-300",
    dot: "bg-rose-400",
    bar: "bg-rose-500",
  },
  High: {
    chip: "border-orange-500/30 bg-orange-500/15 text-orange-300",
    dot: "bg-orange-400",
    bar: "bg-orange-500",
  },
  Medium: {
    chip: "border-amber-500/30 bg-amber-500/15 text-amber-300",
    dot: "bg-amber-400",
    bar: "bg-amber-500",
  },
  Low: {
    chip: "border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
    dot: "bg-emerald-400",
    bar: "bg-emerald-500",
  },
};

export const severityStyle = (severity) =>
  severityStyles[severity] || {
    chip: "border-slate-500/30 bg-slate-500/15 text-slate-300",
    dot: "bg-slate-400",
    bar: "bg-slate-500",
  };

export const accents = {
  violet: {
    icon: "text-violet-300",
    iconBg: "bg-violet-500/15 ring-1 ring-violet-500/25",
    glow: "hover:border-violet-500/40 hover:shadow-violet-900/30",
    value: "text-white",
  },
  amber: {
    icon: "text-amber-300",
    iconBg: "bg-amber-500/15 ring-1 ring-amber-500/25",
    glow: "hover:border-amber-500/40 hover:shadow-amber-900/30",
    value: "text-amber-200",
  },
  rose: {
    icon: "text-rose-300",
    iconBg: "bg-rose-500/15 ring-1 ring-rose-500/25",
    glow: "hover:border-rose-500/40 hover:shadow-rose-900/30",
    value: "text-rose-200",
  },
  sky: {
    icon: "text-sky-300",
    iconBg: "bg-sky-500/15 ring-1 ring-sky-500/25",
    glow: "hover:border-sky-500/40 hover:shadow-sky-900/30",
    value: "text-sky-200",
  },
  emerald: {
    icon: "text-emerald-300",
    iconBg: "bg-emerald-500/15 ring-1 ring-emerald-500/25",
    glow: "hover:border-emerald-500/40 hover:shadow-emerald-900/30",
    value: "text-emerald-200",
  },
};

export const accent = (name) => accents[name] || accents.violet;

// Shared mapping from an HTTP status code to how we describe it.
export const classifyStatus = (statusCode) => {
  if (statusCode === 401)
    return { event: "Failed Login Attempt", severity: "High" };
  if (statusCode === 403)
    return { event: "Unauthorized Access", severity: "High" };
  if (statusCode === 500) return { event: "Server Error", severity: "Critical" };
  if (statusCode === 404)
    return { event: "Repeated Not Found", severity: "Medium" };
  return { event: "Suspicious Activity", severity: "Medium" };
};
