import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import Dashboard from "./pages/Dashboard";
import Alerts from "./pages/Alerts";
import { AnalysisProvider } from "./context/AnalysisContext";

// Recharts measures its container, which is always 0x0 in jsdom. Give the
// responsive wrapper a fixed size so the chart actually renders.
jest.mock("recharts", () => {
  const actual = jest.requireActual("recharts");
  return {
    ...actual,
    ResponsiveContainer: ({ children }) => (
      <actual.ResponsiveContainer width={800} height={300}>
        {children}
      </actual.ResponsiveContainer>
    ),
  };
});

jest.mock("./config/api", () => ({
  ...jest.requireActual("./config/api"),
  api: { get: jest.fn(), post: jest.fn() },
}));

const { api } = require("./config/api");

const SAMPLE = {
  total: 10,
  anomalies_count: 7,
  normal_count: 3,
  anomalies: [
    { ip: "45.33.32.156", status_code: 401, ip_frequency: 5, reason: "5 requests from this IP" },
    { ip: "103.21.244.0", status_code: 403, ip_frequency: 1, reason: "high-risk status 403" },
    { ip: "10.0.0.42", status_code: 500, ip_frequency: 1, reason: "high-risk status 500" },
  ],
  summary: {
    high_frequency_ips: ["10.0.0.42", "45.33.32.156", "103.21.244.0"],
    error_count: 7,
    status_breakdown: { 401: 5, 403: 1, 500: 1 },
  },
};

const renderDashboard = () =>
  render(
    <MemoryRouter>
      <AnalysisProvider>
        <Dashboard />
      </AnalysisProvider>
    </MemoryRouter>
  );

beforeEach(() => {
  sessionStorage.clear();
  jest.clearAllMocks();
  api.get.mockResolvedValue({ data: [] });
});

test("home page renders the upload call to action", () => {
  render(<App />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/detect threats/i);
  expect(screen.getByText(/drag & drop your log file/i)).toBeInTheDocument();
});

test("dashboard shows an empty state before any analysis", () => {
  renderDashboard();
  expect(screen.getByText(/no analysis yet/i)).toBeInTheDocument();
});

test("dashboard renders stats, chart and findings from a stored result", () => {
  sessionStorage.setItem("logsentinel:last-analysis", JSON.stringify(SAMPLE));
  renderDashboard();

  // Stat tiles
  expect(screen.getByText("Total logs")).toBeInTheDocument();
  expect(screen.getByText("10")).toBeInTheDocument();
  expect(screen.getByText("Suspicious IPs")).toBeInTheDocument();

  // Chart categories (single-series, identity from axis labels)
  expect(screen.getByText("Failed login")).toBeInTheDocument();
  expect(screen.getByText("Server error")).toBeInTheDocument();

  // Table of flagged entries
  expect(screen.getByText("45.33.32.156")).toBeInTheDocument();
  expect(screen.getAllByText("Critical").length).toBeGreaterThan(0);

  // Recommendations derived from the summary
  expect(screen.getByText(/possible brute-force attempt/i)).toBeInTheDocument();
});

test("analysis result survives a remount (sessionStorage persistence)", () => {
  sessionStorage.setItem("logsentinel:last-analysis", JSON.stringify(SAMPLE));
  const { unmount } = renderDashboard();
  expect(screen.getByText("Total logs")).toBeInTheDocument();
  unmount();

  renderDashboard();
  expect(screen.getByText("Total logs")).toBeInTheDocument();
});

test("alerts page surfaces a retryable error when the API fails", async () => {
  api.get.mockRejectedValue({ response: { status: 500, data: {} } });

  render(
    <MemoryRouter>
      <AnalysisProvider>
        <Alerts />
      </AnalysisProvider>
    </MemoryRouter>
  );

  await waitFor(() =>
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
  );
  expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
});
