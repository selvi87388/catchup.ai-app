import { useState, useEffect } from "react";
import { TopNav } from "./components/Header";
import { LeftPanel } from "./components/InputSection";
import { RightPanel } from "./components/Dashboard";
import { ScanningOverlay } from "./components/ScanningOverlay";
import { analyzeConversation } from "./analyzer/analyzer";
import { preloadModel, getModelStatus, onModelProgress } from "./analyzer/aiModel";
import type { AnalysisResult } from "./types";

export default function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [scanStage, setScanStage] = useState("Loading on-device AI model...");
  const [modelReady, setModelReady] = useState(getModelStatus() === "ready");

  useEffect(() => {
    onModelProgress((status) => {
      if (status === "ready") setModelReady(true);
    });
    preloadModel();
  }, []);

  const handleClear = () => {
    setResult(null);
    setIsAnalyzing(false);
    setScanStage("Loading on-device AI model...");
  };

  const handleAnalyze = async (text: string) => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeConversation(text, (msg) => setScanStage(msg));
      setResult(analysis);
    } catch (err) {
      console.error("Analysis failed:", err);
      try {
        const analysis = await analyzeConversation(text);
        setResult(analysis);
      } catch {
        // leave result as-is
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0d12] flex flex-col">
      <TopNav modelReady={modelReady} />

      <div className="flex-1 flex flex-col lg:flex-row gap-4 px-4 pb-6 max-w-[1600px] w-full mx-auto">
        {/* Left column — 40% */}
        <div className="lg:w-[40%] lg:min-w-[40%] shrink-0">
          <LeftPanel onAnalyze={handleAnalyze} onClear={handleClear} isAnalyzing={isAnalyzing} />
        </div>

        {/* Right column — 60% */}
        <div className="lg:w-[60%] flex-1 min-w-0">
          <RightPanel result={result} isAnalyzing={isAnalyzing} />
        </div>
      </div>

      {isAnalyzing && (
        <ScanningOverlay stage={scanStage} modelReady={modelReady} />
      )}
    </div>
  );
}
