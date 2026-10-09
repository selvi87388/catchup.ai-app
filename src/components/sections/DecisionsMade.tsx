import { CheckCircle2 } from "lucide-react";
import type { Decision } from "../../types";

export function DecisionsMade({ decisions }: { decisions: Decision[] }) {
  if (decisions.length === 0) {
    return (
      <div className="rounded-lg border border-slate-800 bg-[#111620] p-5">
        <SectionHeader count={0} />
        <p className="text-slate-600 text-xs py-3 text-center font-mono">// No explicit decisions were detected.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-800 bg-[#111620] p-5">
      <SectionHeader count={decisions.length} />
      <ul className="mt-3 space-y-2.5">
        {decisions.map((decision) => (
          <li key={decision.id} className="flex items-start gap-3 animate-slide-up">
            <div className="mt-0.5 shrink-0">
              <div className="w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
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
    <div className="flex items-center gap-2.5">
      <div className="w-7 h-7 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
      </div>
      <h2 className="text-xs font-bold text-white font-mono tracking-wider uppercase">Consensus Decisions</h2>
      {count !== undefined && count > 0 && (
        <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-emerald-400">
          {count}
        </span>
      )}
    </div>
  );
}
