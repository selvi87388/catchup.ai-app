import { Zap, Lock, ShieldOff, Gauge } from "lucide-react";

interface HeaderProps {
  modelReady: boolean;
}

export function TopNav({ modelReady }: HeaderProps) {
  return (
    <nav className="sticky top-0 z-40 border-b border-slate-800 bg-[#0a0d12]/95 backdrop-blur-sm">
      <div className="max-w-[1600px] mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Left: App name + status + version */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-md bg-slate-800/80 border border-slate-700 flex items-center justify-center">
              <Zap className="w-4 h-4 text-emerald-400" fill="currentColor" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight whitespace-nowrap">CatchUp AI</span>
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 animate-pulse-dot"></span>
          <span className="hidden sm:inline-flex items-center rounded-md border border-slate-800 bg-slate-900/60 px-2 py-0.5 text-[10px] font-mono font-medium text-slate-500 shrink-0">
            v1.0 Local-First
          </span>
        </div>

        {/* Right: Badges */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden md:inline-flex items-center gap-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/[0.06] px-2.5 py-1 text-[11px] font-medium text-emerald-400">
            <Lock className="w-3 h-3" />
            100% On-Device
          </div>
          <div className="hidden lg:inline-flex items-center gap-1.5 rounded-md border border-cyan-500/20 bg-cyan-500/[0.06] px-2.5 py-1 text-[11px] font-medium text-cyan-400">
            <ShieldOff className="w-3 h-3" />
            0 Bytes Leaked / Zero Cloud Egress
          </div>
          <div
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium transition-all duration-300 ${
              modelReady
                ? "border border-slate-700 bg-slate-900/60 text-slate-300"
                : "border border-slate-900 bg-slate-950 text-slate-600"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${modelReady ? "bg-emerald-400 animate-pulse-dot" : "bg-slate-700"}`}></span>
            <Gauge className="w-3 h-3" />
            <span className="hidden sm:inline">{modelReady ? "Model Ready" : "Loading..."}</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
