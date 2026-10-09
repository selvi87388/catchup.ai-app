import { MessageCircleWarning, User, Clock, HelpCircle } from "lucide-react";
import type { MentionItem } from "../../types";

interface DirectMentionsProps {
  mentions: MentionItem[];
  answeredCount: number;
}

export function DirectMentions({ mentions, answeredCount }: DirectMentionsProps) {
  if (mentions.length === 0 && answeredCount === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6 shadow-2xl">
        <SectionHeader />
        <p className="text-slate-500 text-sm py-4 text-center">
          No unanswered questions detected. Everything seems addressed!
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/[0.04] backdrop-blur-xl p-6 shadow-2xl">
      <SectionHeader count={mentions.length} />
      {answeredCount > 0 && (
        <p className="text-xs text-cyan-400/50 mb-3 ml-12">
          {answeredCount} question{answeredCount > 1 ? "s were" : " was"} answered in the thread
        </p>
      )}
      <div className="mt-4 space-y-3">
        {mentions.map((mention) => (
          <div
            key={mention.id}
            className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 animate-slide-up transition-all duration-200 hover:border-cyan-400/25 hover:bg-white/[0.05]"
          >
            <div className="mt-0.5 shrink-0">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/15 flex items-center justify-center">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-slate-200 text-sm leading-relaxed">{mention.question}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span className="text-slate-300 font-medium">{mention.person}</span>
                  {mention.person !== mention.sender && (
                    <span className="text-slate-600">— asked by {mention.sender}</span>
                  )}
                </span>
                {mention.timestamp && (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
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
    <div className="flex items-center gap-3 mb-1">
      <div className="w-9 h-9 rounded-xl bg-cyan-500/15 flex items-center justify-center">
        <MessageCircleWarning className="w-5 h-5 text-cyan-400" />
      </div>
      <h2 className="text-lg font-bold text-white">
        <span>👤</span> Direct Mentions & Unanswered Questions
      </h2>
      {count !== undefined && count > 0 && (
        <span className="ml-1 rounded-full bg-white/[0.08] border border-white/[0.06] px-2.5 py-0.5 text-xs font-semibold text-slate-400">
          {count}
        </span>
      )}
    </div>
  );
}
