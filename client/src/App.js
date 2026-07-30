import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Alerts from "./pages/Alerts";
import { AnalysisProvider } from "./context/AnalysisContext";

const NotFound = () => (
  <div className="mx-auto max-w-md px-4 py-32 text-center">
    <p className="font-mono text-sm text-violet-400">404</p>
    <h1 className="heading mt-3 text-2xl">Page not found</h1>
    <p className="mt-2 text-sm text-slate-400">
      That route doesn&apos;t exist.
    </p>
    <Link to="/" className="btn-primary mt-6">
      Back to home
    </Link>
  </div>
);

function App() {
  return (
    <AnalysisProvider>
      <Router>
        <div className="flex min-h-screen flex-col">
          <Navbar />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <footer className="border-t border-white/10 px-4 py-6 sm:px-6 lg:px-8">
            <p className="mx-auto max-w-7xl text-center text-xs text-slate-600">
              LogSentinel AI — anomaly detection for server access logs
            </p>
          </footer>
        </div>
      </Router>
    </AnalysisProvider>
  );
}

export default App;
