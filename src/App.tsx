import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { InputSection } from "./components/InputSection";
import { ScanningOverlay } from "./components/ScanningOverlay";
import { Dashboard } from "./components/Dashboard";
import { analyzeConversation } from "./analyzer/analyzer";
import { preloadModel, getModelStatus, onModelProgress } from "./analyzer/aiModel";
import type { AnalysisResult } from "./types";

type AppState = "input" | "scanning" | "results";

export default function App() {
  const [state, setState] = useState<AppState>("input");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [scanStage, setScanStage] = useState("Loading on-device AI model...");
  const [modelReady, setModelReady] = useState(getModelStatus() === "ready");

  // Preload the AI model in the background on mount
  useEffect(() => {
    onModelProgress((status) => {
      if (status === "ready") setModelReady(true);
    });
    preloadModel();
  }, []);

  const handleAnalyze = async (text: string) => {
    setState("scanning");
    try {
      const analysis = await analyzeConversation(text, (msg) => setScanStage(msg));
      setResult(analysis);
      setState("results");
    } catch (err) {
      console.error("Analysis failed:", err);
      // Fallback: still show results with heuristic-only analysis
      try {
        const analysis = await analyzeConversation(text);
        setResult(analysis);
        setState("results");
      } catch {
        setState("input");
      }
    }
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
        <Header modelReady={modelReady} />

        {state === "input" && (
          <InputSection onAnalyze={handleAnalyze} isAnalyzing={false} />
        )}

        {state === "scanning" && (
          <>
            <InputSection onAnalyze={handleAnalyze} isAnalyzing={true} />
            <ScanningOverlay stage={scanStage} modelReady={modelReady} />
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
