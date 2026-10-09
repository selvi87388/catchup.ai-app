import type { AnalysisResult } from "../types";
import { ActionItems } from "./sections/ActionItems";
import { DecisionsMade } from "./sections/DecisionsMade";
import { TldrSummary } from "./sections/TldrSummary";
import { DirectMentions } from "./sections/DirectMentions";
import { Copy, Download, FileText, Users, MessageCircle, CheckCircle2, AlertCircle, Cpu } from "lucide-react";
import { useState } from "react";

interface DashboardProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
}

export function RightPanel({ result, isAnalyzing }: DashboardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyReport = () => {
    if (!result) return;
    const report = formatReport(result);
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportMarkdown = () => {
    if (!result) return;
    const md = formatMarkdown(result);
    downloadFile("catchup-report.md", md, "text/markdown");
  };

  const handleDownloadSummary = () => {
    if (!result) return;
    const summary = result.summary.sentences.map((s, i) => `${i + 1}. ${s}`).join("\n");
    downloadFile("catchup-summary.txt", summary, "text/plain");
  };

  return (
    <div className="space-y-4">
      {/* Top action row */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={handleCopyReport}
          disabled={!result}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-xs font-medium text-slate-400 transition-all hover:border-slate-700 hover:bg-slate-800/60 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Copy className="w-3.5 h-3.5" />
          {copied ? "Copied!" : "Copy Report"}
        </button>
        <button
          onClick={handleExportMarkdown}
          disabled={!result}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-xs font-medium text-slate-400 transition-all hover:border-slate-700 hover:bg-slate-800/60 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <FileText className="w-3.5 h-3.5" />
          Export Markdown
        </button>
        <button
          onClick={handleDownloadSummary}
          disabled={!result}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-xs font-medium text-slate-400 transition-all hover:border-slate-700 hover:bg-slate-800/60 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Download className="w-3.5 h-3.5" />
          Download Summary
        </button>
      </div>

      {/* Empty state */}
      {!result && !isAnalyzing && (
        <div className="rounded-lg border border-slate-800 bg-[#111620] p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
          <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
            <MessageCircle className="w-6 h-6 text-slate-700" />
          </div>
          <p className="text-sm font-semibold text-slate-400 mb-1">No analysis yet</p>
          <p className="text-xs text-slate-600 font-mono">// Paste a chat log and run the pipeline to see results</p>
        </div>
      )}

      {/* Loading skeleton */}
      {!result && isAnalyzing && (
        <div className="rounded-lg border border-slate-800 bg-[#111620] p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
          <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
            <Cpu className="w-6 h-6 text-emerald-400 animate-pulse" />
          </div>
          <p className="text-sm font-semibold text-slate-300 mb-1">Processing on-device...</p>
          <p className="text-xs text-slate-600 font-mono">// Running local inference pipeline</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-fade-in">
          {/* Metric cards */}
          <div className="grid grid-cols-4 gap-2">
            <StatCard icon={MessageCircle} label="Messages" value={result.totalMessages} />
            <StatCard icon={Users} label="Participants" value={result.participants.length} />
            <StatCard icon={AlertCircle} label="Actions" value={result.actions.length} />
            <StatCard icon={CheckCircle2} label="Decisions" value={result.decisions.length} />
          </div>

          {/* Urgent Actions card */}
          <ActionItems actions={result.actions} />

          {/* TL;DR */}
          <TldrSummary summary={result.summary} />

          {/* Decisions */}
          <DecisionsMade decisions={result.decisions} />

          {/* Mentions */}
          <DirectMentions mentions={result.mentions} answeredCount={0} />
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MessageCircle;
  label: string;
  value: number;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-slate-800 bg-[#111620] py-3 px-2">
      <Icon className="w-4 h-4 text-slate-600 mb-1.5" />
      <p className="text-2xl font-bold text-white leading-none tracking-tight tabular-nums">{value}</p>
      <p className="text-[10px] text-slate-600 mt-1 font-medium uppercase tracking-wider">{label}</p>
    </div>
  );
}

function formatReport(r: AnalysisResult): string {
  const lines: string[] = [];
  lines.push("CatchUp AI — Analysis Report");
  lines.push("=" .repeat(40));
  lines.push(`Messages: ${r.totalMessages} | Participants: ${r.participants.length}`);
  lines.push(`AI: ${r.aiEnabled ? "On-Device Transformers.js" : "Heuristic Fallback"}`);
  lines.push("");
  lines.push("TL;DR:");
  r.summary.sentences.forEach((s, i) => lines.push(`  ${i + 1}. ${s}`));
  lines.push("");
  lines.push("Action Items:");
  r.actions.forEach((a) => lines.push(`  [${a.priority.toUpperCase()}] ${a.task} — ${a.assignee}`));
  lines.push("");
  lines.push("Decisions:");
  r.decisions.forEach((d) => lines.push(`  - ${d.text}`));
  lines.push("");
  lines.push("Unanswered Questions:");
  r.mentions.forEach((m) => lines.push(`  @${m.person}: ${m.question}`));
  return lines.join("\n");
}

function formatMarkdown(r: AnalysisResult): string {
  const lines: string[] = [];
  lines.push("# CatchUp AI — Analysis Report");
  lines.push("");
  lines.push(`**Messages:** ${r.totalMessages} | **Participants:** ${r.participants.length}`);
  lines.push(`**AI:** ${r.aiEnabled ? "On-Device Transformers.js" : "Heuristic Fallback"}`);
  lines.push("");
  lines.push("## TL;DR");
  r.summary.sentences.forEach((s, i) => lines.push(`${i + 1}. ${s}`));
  lines.push("");
  lines.push("## Action Items");
  r.actions.forEach((a) => lines.push(`- **[${a.priority.toUpperCase()}]** ${a.task} — _${a.assignee}_`));
  lines.push("");
  lines.push("## Decisions");
  r.decisions.forEach((d) => lines.push(`- ${d.text}`));
  lines.push("");
  lines.push("## Unanswered Questions");
  r.mentions.forEach((m) => lines.push(`- @${m.person}: ${m.question}`));
  return lines.join("\n");
}

function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
