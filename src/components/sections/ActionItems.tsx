import { AlertTriangle, Clock, User, Zap, Cpu } from "lucide-react";
import type { ActionItem } from "../../types";

interface ActionItemsProps {
  actions: ActionItem[];
}

export function ActionItems({ actions }: ActionItemsProps) {
  if (actions.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <SectionHeader />
        <p className="text-slate-500 text-sm py-4 text-center">No action items detected in this conversation.</p>
      </div>
    );
  }

  // Sort: urgent first, then high — within each group, higher AI score first
  const sorted = [...actions].sort((a, b) => {
    if (a.priority === "urgent" && b.priority !== "urgent") return -1;
    if (a.priority !== "urgent" && b.priority === "urgent") return 1;
    const aScore = a.aiScore ?? 0;
    const bScore = b.aiScore ?? 0;
    return bScore - aScore;
  });

  return (
    <div>
      <SectionHeader count={actions.length} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {sorted.map((action) => (
          <ActionCard key={action.id} action={action} />
        ))}
      </div>
    </div>
  );
}

function SectionHeader({ count }: { count?: number }) {
  return (
    <div className="flex items-center gap-3 mb-1">
      <div className="w-9 h-9 rounded-lg bg-red-500/20 flex items-center justify-center">
        <AlertTriangle className="w-5 h-5 text-red-400" />
      </div>
      <h2 className="text-lg font-bold text-white">
        <span className="text-red-400">🔴</span> Urgent Actions & Deadlines
      </h2>
      {count !== undefined && (
        <span className="ml-1 rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-400">
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
      className={`rounded-xl border p-5 transition-all hover:scale-[1.01] animate-slide-up ${
        isUrgent
          ? "border-red-500/30 bg-red-500/5 hover:border-red-500/50"
          : "border-orange-500/20 bg-orange-500/5 hover:border-orange-500/40"
      }`}
    >
      {/* Priority badge */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
            isUrgent
              ? "bg-red-500/20 text-red-400 border border-red-500/30"
              : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
          }`}
        >
          {isUrgent ? <Zap className="w-3 h-3" fill="currentColor" /> : <Clock className="w-3 h-3" />}
          {action.priority}
        </span>
        <div className="flex items-center gap-2">
          {action.aiScore !== null && (
            <span
              className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-2 py-0.5 text-xs text-blue-400 border border-blue-500/20"
              title={`AI confidence: ${Math.round(action.aiScore * 100)}%`}
            >
              <Cpu className="w-3 h-3" />
              {Math.round(action.aiScore * 100)}%
            </span>
          )}
          {action.deadline && (
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              {action.deadline}
            </span>
          )}
        </div>
      </div>

      {/* Task text */}
      <p className="text-slate-200 text-sm leading-relaxed mb-4">{action.task}</p>

      {/* Footer */}
      <div className="flex items-center gap-2 text-xs text-slate-500 pt-3 border-t border-slate-800">
        <div className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5" />
          <span className="text-slate-400 font-medium">{action.assignee}</span>
        </div>
        <span className="text-slate-700">•</span>
        <span>requested by {action.context}</span>
      </div>
    </div>
  );
}
