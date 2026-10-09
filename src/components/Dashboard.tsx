import type { AnalysisResult } from "../types";
import { ActionItems } from "./sections/ActionItems";
import { DecisionsMade } from "./sections/DecisionsMade";
import { TldrSummary } from "./sections/TldrSummary";
import { DirectMentions } from "./sections/DirectMentions";
import { Users, MessageCircle, CheckCircle2, AlertCircle, Cpu } from "lucide-react";

interface DashboardProps {
  result: AnalysisResult;
  onReset: () => void;
}

export function Dashboard({ result, onReset }: DashboardProps) {
  const urgentCount = result.actions.filter((a) => a.priority === "urgent").length;
  const answeredQuestions = 0;

  return (
    <div className="max-w-5xl mx-auto px-4 pb-16 animate-fade-in">
      {/* AI badge */}
      <div className="mb-4 flex justify-center">
        <div
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium ${
            result.aiEnabled
              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
              : "bg-slate-800/60 text-slate-400 border border-slate-700"
          }`}
        >
          <Cpu className={`w-4 h-4 ${result.aiEnabled ? "animate-pulse" : ""}`} />
          {result.aiEnabled
            ? "Powered by On-Device Transformers.js (WebAssembly / Local)"
            : "Heuristic analysis (AI model was unavailable)"}
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard
          icon={MessageCircle}
          label="Messages"
          value={result.totalMessages}
          color="text-slate-300"
          bg="bg-slate-800/60"
        />
        <StatCard
          icon={Users}
          label="Participants"
          value={result.participants.length}
          color="text-blue-400"
          bg="bg-blue-500/10"
        />
        <StatCard
          icon={AlertCircle}
          label="Action Items"
          value={result.actions.length}
          color="text-orange-400"
          bg="bg-orange-500/10"
        />
        <StatCard
          icon={CheckCircle2}
          label="Decisions"
          value={result.decisions.length}
          color="text-emerald-400"
          bg="bg-emerald-500/10"
        />
      </div>

      {/* Urgent banner */}
      {urgentCount > 0 && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 animate-slide-up">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-red-300">
              {urgentCount} urgent item{urgentCount > 1 ? "s" : ""} need{urgentCount === 1 ? "s" : ""} your attention
            </p>
            <p className="text-xs text-red-400/70">
              Review the action items below — these have immediate deadlines
            </p>
          </div>
        </div>
      )}

      {/* Summary first (TL;DR) */}
      <div className="mb-6">
        <TldrSummary summary={result.summary} />
      </div>

      {/* Action items */}
      <div className="mb-6">
        <ActionItems actions={result.actions} />
      </div>

      {/* Decisions */}
      <div className="mb-6">
        <DecisionsMade decisions={result.decisions} />
      </div>

      {/* Mentions */}
      <div className="mb-6">
        <DirectMentions mentions={result.mentions} answeredCount={answeredQuestions} />
      </div>

      {/* Reset button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-5 py-2.5 text-sm font-medium text-slate-300 transition-all hover:border-slate-600 hover:bg-slate-800 hover:text-white"
        >
          Analyze Another Conversation
        </button>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: {
  icon: typeof MessageCircle;
  label: string;
  value: number;
  color: string;
  bg: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-white leading-none">{value}</p>
        <p className="text-xs text-slate-500 mt-1 truncate">{label}</p>
      </div>
    </div>
  );
}
