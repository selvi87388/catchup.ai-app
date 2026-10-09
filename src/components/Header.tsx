import { Zap, Lock, Cpu } from "lucide-react";

interface HeaderProps {
  modelReady: boolean;
}

export function Header({ modelReady }: HeaderProps) {
  return (
    <header className="text-center pt-16 pb-10 px-4 animate-fade-in">
      <div className="inline-flex items-center justify-center mb-5">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-30 animate-pulse-glow rounded-full"></div>
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40 border border-white/10">
            <Zap className="w-8 h-8 text-white" fill="white" />
          </div>
        </div>
      </div>
      <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
        <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
          CatchUp AI
        </span>
      </h1>
      <p className="mt-4 text-slate-400 text-lg sm:text-xl font-medium">
        Catch up on 100+ unread messages in seconds
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 backdrop-blur-sm px-4 py-2 text-sm font-medium text-emerald-400 shadow-lg shadow-emerald-500/5">
          <Lock className="w-4 h-4" />
          Local-First Processing (Client-Side Only)
        </div>
        <div
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium backdrop-blur-sm transition-all duration-300 ${
            modelReady
              ? "border border-cyan-400/25 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 text-cyan-300 shadow-lg shadow-cyan-500/10"
              : "border border-white/[0.08] bg-white/[0.03] text-slate-500"
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${modelReady ? "bg-cyan-400 animate-pulse-dot text-cyan-400" : "bg-slate-600"}`}></span>
          <Cpu className="w-4 h-4" />
          {modelReady
            ? "Powered by On-Device Transformers.js (WebAssembly / Local)"
            : "Loading on-device AI model..."}
        </div>
      </div>
    </header>
  );
}
