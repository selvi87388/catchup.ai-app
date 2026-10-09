import { MessageCircleWarning, User, Clock, HelpCircle } from "lucide-react";
import type { MentionItem } from "../../types";

interface DirectMentionsProps {
  mentions: MentionItem[];
  answeredCount: number;
}

export function DirectMentions({ mentions, answeredCount }: DirectMentionsProps) {
  if (mentions.length === 0 && answeredCount === 0) {
    return (
      <div className="rounded-lg border border-slate-800 bg-[#111620] p-5">
        <SectionHeader count={0} />
        <p className="text-slate-600 text-xs py-3 text-center font-mono">// No unanswered questions detected. Everything seems addressed!</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-800 bg-[#111620] p-5">
      <SectionHeader count={mentions.length} />
      {answeredCount > 0 && (
        <p className="text-[11px] text-slate-600 mb-3 ml-9 font-mono">
          {answeredCount} question{answeredCount > 1 ? "s were" : " was"} answered in the thread
        </p>
      )}
      <div className="mt-3 space-y-2.5">
        {mentions.map((mention) => (
          <div
            key={mention.id}
            className="flex items-start gap-3 rounded-md border border-slate-800/50 bg-slate-900/30 p-3 animate-slide-up transition-all duration-200 hover:border-slate-700"
          >
            <div className="mt-0.5 shrink-0">
              <div className="w-6 h-6 rounded bg-cyan-500/10 flex items-center justify-center">
                <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-slate-200 text-sm leading-relaxed">{mention.question}</p>
              <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <User className="w-3 h-3" />
                  <span className="text-slate-300 font-medium">{mention.person}</span>
                  {mention.person !== mention.sender && (
                    <span className="text-slate-700">— asked by {mention.sender}</span>
                  )}
                </span>
                {mention.timestamp && (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {mention.timestamp}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionHeader({ count }: { count?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-7 h-7 rounded-md bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
        <MessageCircleWarning className="w-3.5 h-3.5 text-cyan-400" />
      </div>
      <h2 className="text-xs font-bold text-white font-mono tracking-wider uppercase">Unanswered Questions / Direct Mentions</h2>
      {count !== undefined && count > 0 && (
        <span className="rounded bg-cyan-500/10 border border-cyan-500/20 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-cyan-400">
          {count}
        </span>
      )}
    </div>
  );
}
