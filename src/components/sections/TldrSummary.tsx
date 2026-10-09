import { FileText } from "lucide-react";
import type { Summary } from "../../types";

export function TldrSummary({ summary }: { summary: Summary }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-[#111620] p-5">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-7 h-7 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center">
          <FileText className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <h2 className="text-xs font-bold text-white font-mono tracking-wider uppercase">Executive TL;DR Summary</h2>
      </div>
      <div className="space-y-2">
        {summary.sentences.map((sentence, i) => (
          <p key={i} className="text-slate-300 leading-relaxed text-sm">
            <span className="text-slate-600 font-mono font-bold mr-1.5">{i + 1}.</span>
            {sentence}
          </p>
        ))}
      </div>
    </div>
  );
}
