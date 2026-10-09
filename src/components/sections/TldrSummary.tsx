import { FileText } from "lucide-react";
import type { Summary } from "../../types";

export function TldrSummary({ summary }: { summary: Summary }) {
  return (
    <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-slate-900 to-blue-950/30 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center">
          <FileText className="w-5 h-5 text-blue-400" />
        </div>
        <h2 className="text-lg font-bold text-white">
          <span className="text-blue-400">🔵</span> TL;DR Summary
        </h2>
      </div>
      <div className="space-y-3">
        {summary.sentences.map((sentence, i) => (
          <p key={i} className="text-slate-300 leading-relaxed text-[15px]">
            <span className="text-blue-500 font-bold mr-1">{i + 1}.</span>
            {sentence}
          </p>
        ))}
      </div>
    </div>
  );
}
