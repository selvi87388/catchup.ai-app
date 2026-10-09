import { Zap, Lock, Cpu } from "lucide-react";

interface HeaderProps {
  modelReady: boolean;
}

export function Header({ modelReady }: HeaderProps) {
  return (
    <header className="text-center pt-14 pb-8 px-4 animate-fade-in">
      <div className="inline-flex items-center justify-center mb-4">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse-glow"></div>
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Zap className="w-7 h-7 text-white" fill="white" />
          </div>
        </div>
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
        CatchUp{" "}
        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          AI
        </span>
      </h1>
      <p className="mt-3 text-slate-400 text-lg sm:text-xl font-medium">
        Catch up on 100+ unread messages in seconds
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400">
          <Lock className="w-4 h-4" />
          Local-First Processing (Client-Side Only)
        </div>
        <div
          className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
            modelReady
              ? "border border-blue-500/30 bg-blue-500/10 text-blue-400"
              : "border border-slate-700 bg-slate-800/50 text-slate-500"
          }`}
        >
          <Cpu className={`w-4 h-4 ${modelReady ? "animate-pulse" : ""}`} />
          {modelReady
            ? "Powered by On-Device Transformers.js (WebAssembly / Local)"
            : "Loading on-device AI model..."}
        </div>
      </div>
    </header>
  );
}
