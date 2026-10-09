import { useState } from "react";
import { Zap, FileText, MessageSquare, Loader2, Trash2 } from "lucide-react";
import { SLACK_SAMPLE, WHATSAPP_SAMPLE } from "../sampleData";

interface InputSectionProps {
  onAnalyze: (text: string) => void;
  isAnalyzing: boolean;
}

export function InputSection({ onAnalyze, isAnalyzing }: InputSectionProps) {
  const [text, setText] = useState("");

  const handleSlack = () => setText(SLACK_SAMPLE);
  const handleWhatsApp = () => setText(WHATSAPP_SAMPLE);
  const handleClear = () => setText("");

  const handleAnalyze = () => {
    if (text.trim().length < 10) return;
    onAnalyze(text);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pb-10">
      {/* Demo buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
        <button
          onClick={handleSlack}
          disabled={isAnalyzing}
          className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl px-4 py-2.5 text-sm font-medium text-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-400/30 hover:bg-white/[0.08] hover:text-white shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          <MessageSquare className="w-4 h-4 text-indigo-400" />
          Load Project Slack Chat
        </button>
        <button
          onClick={handleWhatsApp}
          disabled={isAnalyzing}
          className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl px-4 py-2.5 text-sm font-medium text-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-400/30 hover:bg-white/[0.08] hover:text-white shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          <MessageSquare className="w-4 h-4 text-emerald-400" />
          Load WhatsApp Group Chat
        </button>
      </div>

      {/* Text area */}
      <div className="relative">
        <div className="absolute -top-3 left-5 z-10 inline-flex items-center gap-1.5 rounded-lg bg-[#0a0f1d] px-2.5 py-1 text-xs font-medium text-slate-500 border border-white/[0.08]">
          <FileText className="w-3.5 h-3.5" />
          Paste Conversation Log
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isAnalyzing}
          placeholder={"Paste your group chat here...\n\nFormat examples:\n[10:30 AM] Name: message\n10/9/26, 8:15 PM - Name: message\nName: message\n\nOr click a demo button above to try it instantly."}
          className="w-full h-72 rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-5 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all duration-200 resize-y focus:border-indigo-400/30 focus:ring-2 focus:ring-indigo-500/10 disabled:opacity-50 font-mono leading-relaxed shadow-2xl"
        />
        {text && !isAnalyzing && (
          <button
            onClick={handleClear}
            className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-lg bg-white/[0.06] px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-white/[0.12] transition-colors backdrop-blur-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Analyze button */}
      <div className="mt-8 flex flex-col items-center gap-3">
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || text.trim().length < 10}
          className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-10 py-4 text-base font-bold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-blue-500 hover:to-indigo-500 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:translate-y-0 active:scale-[0.98]"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" fill="white" />
              Analyze & Catch Up
            </>
          )}
        </button>
        {text.trim().length < 10 && !isAnalyzing && (
          <p className="text-xs text-slate-600">
            Paste a conversation or load a demo to get started
          </p>
        )}
      </div>
    </div>
  );
}
