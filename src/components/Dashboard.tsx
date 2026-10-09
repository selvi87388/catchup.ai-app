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
      <div className="mb-6 flex justify-center">
        <div
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium backdrop-blur-sm transition-all ${
            result.aiEnabled
              ? "bg-gradient-to-r from-cyan-500/10 to-violet-500/10 text-cyan-300 border border-cyan-400/25 shadow-lg shadow-cyan-500/10"
              : "bg-white/[0.04] text-slate-400 border border-white/[0.08]"
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${result.aiEnabled ? "bg-cyan-400 animate-pulse-dot text-cyan-400" : "bg-slate-600"}`}></span>
          <Cpu className="w-4 h-4" />
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
          iconColor="text-slate-300"
          iconBg="bg-slate-500/15"
          dotColor="bg-slate-400"
        />
        <StatCard
          icon={Users}
          label="Participants"
          value={result.participants.length}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/15"
          dotColor="bg-blue-400"
        />
        <StatCard
          icon={AlertCircle}
          label="Action Items"
          value={result.actions.length}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/15"
          dotColor="bg-amber-400"
        />
        <StatCard
          icon={CheckCircle2}
          label="Decisions"
          value={result.decisions.length}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/15"
          dotColor="bg-emerald-400"
        />
      </div>

      {/* Urgent banner */}
      {urgentCount > 0 && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-rose-500/25 bg-rose-500/[0.08] backdrop-blur-xl px-5 py-4 animate-slide-up shadow-2xl">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-rose-300">
              {urgentCount} urgent item{urgentCount > 1 ? "s" : ""} need{urgentCount === 1 ? "s" : ""} your attention
            </p>
            <p className="text-xs text-rose-400/60 mt-0.5">
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
          className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl px-6 py-3 text-sm font-medium text-slate-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.15] hover:bg-white/[0.08] hover:text-white shadow-lg"
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
  iconColor,
  iconBg,
  dotColor,
}: {
  icon: typeof MessageCircle;
  label: string;
  value: number;
  iconColor: string;
  iconBg: string;
  dotColor: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-4 shadow-2xl transition-all duration-200 hover:border-white/[0.12] hover:bg-white/[0.06]">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
          <p className="text-2xl font-bold text-white leading-none tracking-tight">{value}</p>
        </div>
        <p className="text-xs text-slate-500 mt-1.5 truncate">{label}</p>
      </div>
    </div>
  );
}
