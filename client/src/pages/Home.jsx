import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CircleAlert,
  Clock,
  FileText,
  LoaderCircle,
  Network,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Trash2,
  Zap,
} from "lucide-react";
import UploadZone from "../components/UploadZone";
import { api, describeError } from "../config/api";
import { useAnalysis } from "../context/AnalysisContext";

const features = [
  {
    icon: Zap,
    title: "Brute-force detection",
    body: "Flags IPs hammering your login endpoints with repeated 401s.",
  },
  {
    icon: Network,
    title: "Traffic anomalies",
    body: "Surfaces addresses generating abnormal request volume.",
  },
  {
    icon: ShieldCheck,
    title: "Actionable guidance",
    body: "Every finding comes with a recommended next step.",
  },
];

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const MAX_BYTES = 10 * 1024 * 1024;

const Home = () => {
  const navigate = useNavigate();
  const { setAnalysisResult, setFileName } = useAnalysis();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [slowWarning, setSlowWarning] = useState(false);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const selectFile = (nextFile) => {
    setError(null);

    if (nextFile.size > MAX_BYTES) {
      setFile(null);
      setError({
        title: "That file is too large",
        detail: `${formatSize(nextFile.size)} exceeds the 10 MB limit. Try splitting the log first.`,
      });
      return;
    }

    if (nextFile.size === 0) {
      setFile(null);
      setError({
        title: "That file is empty",
        detail: "There is nothing to analyse in a zero-byte file.",
      });
      return;
    }

    setFile(nextFile);
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setSlowWarning(false);

    // The analysis service sleeps on free hosting; let the user know why the
    // first run is slow instead of leaving them staring at a spinner.
    timerRef.current = setTimeout(() => setSlowWarning(true), 8000);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await api.post("/api/analyze", formData);

      setAnalysisResult(data);
      setFileName(file.name);
      navigate("/dashboard");
    } catch (err) {
      setError(describeError(err));
    } finally {
      clearTimeout(timerRef.current);
      setLoading(false);
      setSlowWarning(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-14 sm:px-6 lg:px-8">
      <section className="flex flex-col items-center text-center">
        <span className="chip animate-fade-up border-violet-500/25 bg-violet-500/10 text-violet-300">
          <Sparkles className="h-3.5 w-3.5" />
          AI-powered log monitoring
        </span>

        <h1
          style={{ animationDelay: "60ms" }}
          className="animate-fade-up mt-6 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-6xl"
        >
          Detect threats.{" "}
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-sky-400 bg-clip-text text-transparent">
            Instantly.
          </span>
        </h1>

        <p
          style={{ animationDelay: "120ms" }}
          className="animate-fade-up mt-5 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg"
        >
          Upload a server access log and LogSentinel surfaces brute-force
          attempts, unauthorised access and error spikes in seconds.
        </p>
      </section>

      <section
        style={{ animationDelay: "180ms" }}
        className="animate-fade-up mx-auto mt-12 w-full max-w-2xl"
      >
        <div className="surface p-5 shadow-2xl shadow-black/40 sm:p-6">
          {!file ? (
            <UploadZone onFileSelect={selectFile} disabled={loading} />
          ) : (
            <div className="rounded-2xl border border-violet-500/25 bg-violet-500/[0.07] p-5">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 ring-1 ring-violet-500/25">
                  <FileText className="h-5 w-5 text-violet-300" />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-white" title={file.name}>
                    {file.name}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-400">
                    {formatSize(file.size)} · ready to analyse
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setError(null);
                  }}
                  disabled={loading}
                  aria-label="Remove selected file"
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-rose-300 disabled:opacity-40"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="btn-primary mt-5 w-full py-3"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Analysing logs…
                  </>
                ) : (
                  <>
                    Analyse logs
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              {slowWarning && (
                <p className="mt-3 flex items-start gap-2 text-xs text-amber-300/90">
                  <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  Still working — the analysis service may be waking from sleep.
                  This can take up to a minute on the first run.
                </p>
              )}
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mt-5 flex items-start gap-3 rounded-xl border border-rose-500/25 bg-rose-500/[0.08] p-4"
            >
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-rose-200">
                  {error.title}
                </p>
                {error.detail && (
                  <p className="mt-1 break-words text-xs leading-relaxed text-rose-200/70">
                    {error.detail}
                  </p>
                )}
                {file && (
                  <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="btn-ghost mt-3 px-3 py-1.5 text-xs"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Try again
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mt-16 grid gap-4 sm:grid-cols-3">
        {features.map(({ icon: Icon, title, body }, index) => (
          <div
            key={title}
            style={{ animationDelay: `${240 + index * 70}ms` }}
            className="surface surface-hover animate-fade-up p-5"
          >
            <span className="inline-flex rounded-lg bg-violet-500/15 p-2 ring-1 ring-violet-500/25">
              <Icon className="h-4 w-4 text-violet-300" />
            </span>
            <h3 className="heading mt-4 text-sm">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{body}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;
