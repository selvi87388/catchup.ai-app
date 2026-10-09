import { Loader2, Search, Sparkles, ListChecks, Cpu } from "lucide-react";

interface ScanningOverlayProps {
  stage: string;
  modelReady: boolean;
}

export function ScanningOverlay({ stage, modelReady }: ScanningOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 animate-fade-in">
      <div className="relative w-full max-w-md mx-4">
        <div className="relative overflow-hidden rounded-lg border border-slate-800 bg-[#111620] p-8">
          <div className="absolute left-0 right-0 h-px bg-emerald-500/40 animate-scan-line"></div>

          <div className="flex flex-col items-center text-center">
            <div className="mb-5">
              <div className="w-14 h-14 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
                <Loader2 className="w-7 h-7 text-emerald-400 animate-spin" />
              </div>
            </div>

            <h3 className="text-sm font-bold text-white mb-1.5 font-mono">
              Analyzing conversation...
            </h3>
            <p className="text-xs text-slate-500 mb-5 font-mono">
              {stage}
            </p>

            <div className="w-full space-y-2 text-left">
              <ScanStep icon={Search} label="Scanning messages" delay="0ms" />
              <ScanStep icon={ListChecks} label="Identifying action items" delay="150ms" />
              <ScanStep icon={Sparkles} label="Generating summary" delay="300ms" />
            </div>

            <div className="mt-5 w-full">
              <div
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-[11px] font-medium transition-all ${
                  modelReady
                    ? "bg-slate-900 text-slate-300 border border-slate-800"
                    : "bg-slate-950 text-slate-600 border border-slate-900"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${modelReady ? "bg-emerald-400 animate-pulse-dot" : "bg-slate-700"}`}></span>
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
      className="flex items-center gap-3 rounded-md bg-slate-900/50 border border-slate-800/50 px-3 py-2 animate-slide-up"
      style={{ animationDelay: delay, opacity: 0 }}
    >
      <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center shrink-0">
        <Icon className="w-3 h-3 text-slate-400" />
      </div>
      <span className="text-xs text-slate-300 font-medium font-mono">{label}</span>
      <Loader2 className="w-3 h-3 text-slate-700 animate-spin ml-auto" />
    </div>
  );
}
