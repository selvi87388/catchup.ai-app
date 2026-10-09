import { Loader2, Search, Sparkles, ListChecks, Cpu } from "lucide-react";

interface ScanningOverlayProps {
  stage: string;
  modelReady: boolean;
}

export function ScanningOverlay({ stage, modelReady }: ScanningOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0f1d]/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md mx-4">
        {/* Scanning card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-8 shadow-2xl">
          {/* Scan line */}
          <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_20px_rgba(129,140,248,0.8)] animate-scan-line"></div>

          <div className="flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-40 animate-pulse-glow rounded-full"></div>
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600 flex items-center justify-center border border-white/10">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-2">
              Analyzing conversation...
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              {stage}
            </p>

            {/* Progress steps */}
            <div className="w-full space-y-2.5 text-left">
              <ScanStep icon={Search} label="Scanning messages" delay="0ms" />
              <ScanStep icon={ListChecks} label="Identifying action items" delay="150ms" />
              <ScanStep icon={Sparkles} label="Generating summary" delay="300ms" />
            </div>

            {/* AI badge */}
            <div className="mt-6 w-full">
              <div
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                  modelReady
                    ? "bg-gradient-to-r from-cyan-500/10 to-violet-500/10 text-cyan-300 border border-cyan-400/20"
                    : "bg-white/[0.03] text-slate-500 border border-white/[0.08]"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${modelReady ? "bg-cyan-400 animate-pulse-dot text-cyan-400" : "bg-slate-600"}`}></span>
                <Cpu className="w-3.5 h-3.5" />
                {modelReady
                  ? "On-device AI inference active (WebAssembly)"
                  : "Heuristic analysis (AI model loading...)"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScanStep({
  icon: Icon,
  label,
  delay,
}: {
  icon: typeof Search;
  label: string;
  delay: string;
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl bg-white/[0.04] border border-white/[0.06] px-4 py-2.5 animate-slide-up"
      style={{ animationDelay: delay, opacity: 0 }}
    >
      <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-indigo-400" />
      </div>
      <span className="text-sm text-slate-300 font-medium">{label}</span>
      <Loader2 className="w-4 h-4 text-slate-600 animate-spin ml-auto" />
    </div>
  );
}
