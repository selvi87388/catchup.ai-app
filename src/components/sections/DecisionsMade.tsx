import { CheckCircle2 } from "lucide-react";
import type { Decision } from "../../types";

export function DecisionsMade({ decisions }: { decisions: Decision[] }) {
  if (decisions.length === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6 shadow-2xl">
        <SectionHeader />
        <p className="text-slate-500 text-sm py-4 text-center">No explicit decisions were detected in this conversation.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.04] backdrop-blur-xl p-6 shadow-2xl">
      <SectionHeader count={decisions.length} />
      <ul className="mt-5 space-y-3">
        {decisions.map((decision) => (
          <li key={decision.id} className="flex items-start gap-3 animate-slide-up">
            <div className="mt-0.5 shrink-0">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{decision.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SectionHeader({ count }: { count?: number }) {
  return (
    <div className="flex items-center gap-3 mb-1">
      <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center">
        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
      </div>
      <h2 className="text-lg font-bold text-white">
        <span className="text-emerald-400">🟢</span> Decisions Made
      </h2>
      {count !== undefined && (
        <span className="ml-1 rounded-full bg-white/[0.08] border border-white/[0.06] px-2.5 py-0.5 text-xs font-semibold text-slate-400">
          {count}
        </span>
      )}
    </div>
  );
}
