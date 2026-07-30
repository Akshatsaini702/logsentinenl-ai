import axios from "axios";

// Override at build time with REACT_APP_API_URL so the same bundle can point at
// a local server during development.
export const API_BASE_URL = (
  process.env.REACT_APP_API_URL || "https://logsentinenl-ai.onrender.com"
).replace(/\/+$/, "");

export const api = axios.create({
  baseURL: API_BASE_URL,
  // The backend may need to wake a sleeping analysis service, which is slow on
  // free hosting tiers.
  timeout: 180000,
});

export const REPORT_URL = `${API_BASE_URL}/api/report`;

/**
 * Turns an axios failure into something a person can act on.
 */
export const describeError = (error) => {
  if (error.code === "ECONNABORTED") {
    return {
      title: "The request timed out",
      detail:
        "The server took too long to respond. Free hosting tiers sleep when idle — please try again in a minute.",
    };
  }

  const data = error.response?.data;
  if (data?.error) {
    return { title: data.error, detail: data.detail || "" };
  }

  if (!error.response) {
    return {
      title: "Cannot reach the server",
      detail: "Check your connection and try again.",
    };
  }

  return {
    title: "Something went wrong",
    detail: `The server responded with status ${error.response.status}.`,
  };
};
