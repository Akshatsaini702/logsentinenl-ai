import { createContext, useContext, useState } from "react";

const AnalysisContext = createContext();

export const AnalysisProvider = ({ children }) => {
  const [analysisResult, setAnalysisResult] = useState(null);

  return (
    <AnalysisContext.Provider
      value={{
        analysisResult,
        setAnalysisResult,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  return useContext(AnalysisContext);
};