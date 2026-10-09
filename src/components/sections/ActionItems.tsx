import { AlertTriangle, Clock, User, Zap, Cpu } from "lucide-react";
import type { ActionItem } from "../../types";

interface ActionItemsProps {
  actions: ActionItem[];
}

export function ActionItems({ actions }: ActionItemsProps) {
  const urgentCount = actions.filter((a) => a.priority === "urgent").length;

  if (actions.length === 0) {
    return (
      <div className="rounded-lg border border-rose-500/20 bg-rose-500/[0.03] p-5">
        <SectionHeader count={0} urgentCount={0} />
        <p className="text-slate-600 text-xs py-3 text-center font-mono">// No action items detected in this conversation.</p>
      </div>
    );
  }

  const sorted = [...actions].sort((a, b) => {
    if (a.priority === "urgent" && b.priority !== "urgent") return -1;
    if (a.priority !== "urgent" && b.priority === "urgent") return 1;
    const aScore = a.aiScore ?? 0;
    const bScore = b.aiScore ?? 0;
    return bScore - aScore;
  });

  return (
    <div className="rounded-lg border border-rose-500/20 bg-rose-500/[0.03] p-5">
      <SectionHeader count={actions.length} urgentCount={urgentCount} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 mt-3">
        {sorted.map((action) => (
          <ActionCard key={action.id} action={action} />
        ))}
      </div>
    </div>
  );
}

function SectionHeader({ count, urgentCount }: { count: number; urgentCount: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-7 h-7 rounded-md bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
      </div>
      <h2 className="text-xs font-bold text-white font-mono tracking-wider uppercase">
        {urgentCount > 0 ? "[LEVEL 1] Critical Actions" : "Urgent Actions & Deadlines"}
      </h2>
      {count > 0 && (
        <span className="rounded bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-rose-400">
          {count}
        </span>
      )}
    </div>
  );
}

function ActionCard({ action }: { action: ActionItem }) {
  const isUrgent = action.priority === "urgent";

  return (
    <div
      className={`rounded-md border p-4 transition-all duration-200 animate-slide-up ${
        isUrgent
          ? "border-rose-500/20 bg-rose-500/[0.04] hover:border-rose-500/30"
          : "border-amber-500/15 bg-amber-500/[0.02] hover:border-amber-500/25"
      }`}
    >
      <div className="flex items-center justify-between mb-2.5">
        <span
          className={`inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider font-mono ${
            isUrgent
              ? "bg-rose-500/10 text-rose-400 border border-rose-500/25"
              : "bg-amber-500/10 text-amber-400 border border-amber-500/25"
          }`}
        >
          {isUrgent ? <Zap className="w-2.5 h-2.5" fill="currentColor" /> : <Clock className="w-2.5 h-2.5" />}
          {action.priority}
        </span>
        <div className="flex items-center gap-2">
          {action.aiScore !== null && (
            <span
              className="inline-flex items-center gap-1 rounded bg-slate-900 border border-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400 font-mono"
              title={`AI confidence: ${Math.round(action.aiScore * 100)}%`}
            >
              <Cpu className="w-2.5 h-2.5" />
              {Math.round(action.aiScore * 100)}%
            </span>
          )}
          {action.deadline && (
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-mono">
              <Clock className="w-3 h-3" />
              {action.deadline}
            </span>
          )}
        </div>
      </div>

      <p className="text-slate-200 text-sm leading-relaxed mb-3">{action.task}</p>

      <div className="flex items-center gap-2 text-[11px] text-slate-600 pt-2 border-t border-slate-800/50">
        <div className="flex items-center gap-1.5">
          <User className="w-3 h-3" />
          <span className="text-slate-300 font-medium">{action.assignee}</span>
        </div>
        <span className="text-slate-800">·</span>
        <span>requested by {action.context}</span>
      </div>
    </div>
  );
}
