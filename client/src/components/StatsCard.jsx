import { accent } from "../config/theme";

const StatsCard = ({ title, value, hint, icon: Icon, color = "violet", delay = 0 }) => {
  const tone = accent(color);

  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className={`surface animate-fade-up p-5 shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-0.5 ${tone.glow}`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {title}
        </p>
        <span className={`rounded-lg p-2 ${tone.iconBg}`}>
          {Icon && <Icon className={`h-4 w-4 ${tone.icon}`} />}
        </span>
      </div>

      <p className={`mt-4 text-3xl font-semibold tracking-tight ${tone.value}`}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>

      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
};

export default StatsCard;
