import { useState } from "react";
import { Header } from "./components/Header";
import { InputSection } from "./components/InputSection";
import { ScanningOverlay } from "./components/ScanningOverlay";
import { Dashboard } from "./components/Dashboard";
import { analyzeConversation } from "./analyzer/analyzer";
import type { AnalysisResult } from "./types";

type AppState = "input" | "scanning" | "results";

export default function App() {
  const [state, setState] = useState<AppState>("input");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = (text: string) => {
    setState("scanning");
    // 1-second scanning animation, then show results
    setTimeout(() => {
      const analysis = analyzeConversation(text);
      setResult(analysis);
      setState("results");
    }, 1000);
  };

  const handleReset = () => {
    setResult(null);
    setState("input");
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-x-hidden">
      {/* Background glow accents */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/3 right-0 w-[300px] h-[300px] bg-cyan-600/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-blue-600/5 rounded-full blur-[100px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Header />

        {state === "input" && (
          <InputSection onAnalyze={handleAnalyze} isAnalyzing={false} />
        )}

        {state === "scanning" && (
          <>
            <InputSection onAnalyze={handleAnalyze} isAnalyzing={true} />
            <ScanningOverlay />
          </>
        )}

        {state === "results" && result && (
          <Dashboard result={result} onReset={handleReset} />
        )}

        {/* Footer */}
        <footer className="text-center pb-8 pt-4 px-4">
          <p className="text-xs text-slate-600">
            CatchUp AI — All processing happens in your browser. No data leaves your device.
          </p>
        </footer>
      </div>
    </div>
  );
}
