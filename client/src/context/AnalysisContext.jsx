import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AnalysisContext = createContext(null);
const STORAGE_KEY = "logsentinel:last-analysis";

const readStored = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AnalysisProvider = ({ children }) => {
  // Restored from sessionStorage so a refresh on /dashboard doesn't wipe the
  // report the user just generated.
  const [analysisResult, setAnalysisResult] = useState(readStored);
  const [fileName, setFileName] = useState(
    () => sessionStorage.getItem(`${STORAGE_KEY}:file`) || ""
  );

  useEffect(() => {
    try {
      if (analysisResult) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(analysisResult));
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Quota or private-mode failures are not worth breaking the app over.
    }
  }, [analysisResult]);

  useEffect(() => {
    try {
      if (fileName) sessionStorage.setItem(`${STORAGE_KEY}:file`, fileName);
      else sessionStorage.removeItem(`${STORAGE_KEY}:file`);
    } catch {
      /* ignore */
    }
  }, [fileName]);

  const value = useMemo(
    () => ({
      analysisResult,
      setAnalysisResult,
      fileName,
      setFileName,
      hasResult: Boolean(analysisResult),
      clearAnalysis: () => {
        setAnalysisResult(null);
        setFileName("");
      },
    }),
    [analysisResult, fileName]
  );

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error("useAnalysis must be used inside an AnalysisProvider");
  }
  return context;
};
