import { Loader2, Search, Sparkles, ListChecks } from "lucide-react";

export function ScanningOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md mx-4">
        {/* Scanning card */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-2xl">
          {/* Scan line */}
          <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_12px_rgba(96,165,250,0.8)] animate-scan-line"></div>

          <div className="flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-blue-500 blur-xl opacity-30 animate-pulse-glow"></div>
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-2">
              Analyzing conversation...
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              Extracting tasks, decisions, and unanswered questions
            </p>

            {/* Progress steps */}
            <div className="w-full space-y-3 text-left">
              <ScanStep icon={Search} label="Scanning messages" delay="0ms" />
              <ScanStep icon={ListChecks} label="Identifying action items" delay="200ms" />
              <ScanStep icon={Sparkles} label="Generating summary" delay="400ms" />
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
      className="flex items-center gap-3 rounded-lg bg-slate-800/50 px-4 py-2.5 animate-slide-up"
      style={{ animationDelay: delay, opacity: 0 }}
    >
      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-blue-400" />
      </div>
      <span className="text-sm text-slate-300 font-medium">{label}</span>
      <Loader2 className="w-4 h-4 text-slate-600 animate-spin ml-auto" />
    </div>
  );
}
