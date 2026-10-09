import { FileText } from "lucide-react";
import type { Summary } from "../../types";

export function TldrSummary({ summary }: { summary: Summary }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-indigo-500/[0.08] via-white/[0.03] to-blue-500/[0.06] backdrop-blur-xl p-6 shadow-2xl">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center">
          <FileText className="w-5 h-5 text-blue-400" />
        </div>
        <h2 className="text-lg font-bold text-white">
          <span className="text-blue-400">🔵</span> TL;DR Summary
        </h2>
      </div>
      <div className="space-y-3">
        {summary.sentences.map((sentence, i) => (
          <p key={i} className="text-slate-300 leading-relaxed text-[15px]">
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent font-bold mr-1.5">
              {i + 1}.
            </span>
            {sentence}
          </p>
        ))}
      </div>
    </div>
  );
}
