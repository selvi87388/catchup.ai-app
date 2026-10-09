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
    <div className="min-h-screen bg-[#0a0f1d] relative overflow-x-hidden">
      {/* Ambient radial glow background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-indigo-600/12 rounded-full blur-[140px] animate-float"></div>
        <div className="absolute top-[30%] right-[-5%] w-[400px] h-[400px] bg-violet-600/8 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] left-[-5%] w-[450px] h-[350px] bg-cyan-600/8 rounded-full blur-[120px]"></div>
        <div className="absolute top-[60%] left-[30%] w-[300px] h-[300px] bg-blue-600/6 rounded-full blur-[100px]"></div>
      </div>

      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

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
        <footer className="text-center pb-10 pt-6 px-4">
          <p className="text-xs text-slate-600">
            CatchUp AI — All processing happens in your browser. No data leaves your device.
          </p>
        </footer>
      </div>
    </div>
  );
}
