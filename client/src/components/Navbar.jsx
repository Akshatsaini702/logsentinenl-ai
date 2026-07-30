import { NavLink } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useAnalysis } from "../context/AnalysisContext";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/alerts", label: "Alerts" },
];

const Navbar = () => {
  const { hasResult } = useAnalysis();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink-950/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <NavLink to="/" className="group flex items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 ring-1 ring-violet-500/30">
            <ShieldCheck className="h-5 w-5 text-violet-300" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-white">
            LogSentinel <span className="text-violet-400">AI</span>
          </span>
        </NavLink>

        <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
          {links.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `relative rounded-lg px-3 py-1.5 text-sm font-medium transition sm:px-4 ${
                  isActive
                    ? "bg-violet-600 text-white shadow shadow-violet-900/40"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {label}
              {label === "Dashboard" && hasResult && (
                <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
