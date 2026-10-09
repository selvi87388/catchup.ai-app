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
    <div className="max-w-3xl mx-auto px-4 pb-8">
      {/* Demo buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
        <button
          onClick={handleSlack}
          disabled={isAnalyzing}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm font-medium text-slate-200 transition-all hover:border-blue-500/50 hover:bg-slate-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MessageSquare className="w-4 h-4 text-blue-400" />
          Load Project Slack Chat
        </button>
        <button
          onClick={handleWhatsApp}
          disabled={isAnalyzing}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm font-medium text-slate-200 transition-all hover:border-emerald-500/50 hover:bg-slate-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MessageSquare className="w-4 h-4 text-emerald-400" />
          Load WhatsApp Group Chat
        </button>
      </div>

      {/* Text area */}
      <div className="relative">
        <div className="absolute -top-3 left-5 z-10 inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-2.5 py-1 text-xs font-medium text-slate-500 border border-slate-800">
          <FileText className="w-3.5 h-3.5" />
          Paste Conversation Log
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isAnalyzing}
          placeholder={"Paste your group chat here...\n\nFormat examples:\n[10:30 AM] Name: message\nName: message\n\nOr click a demo button above to try it instantly."}
          className="w-full h-72 rounded-xl border border-slate-700 bg-slate-900/80 p-5 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all resize-y focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60 font-mono leading-relaxed"
        />
        {text && !isAnalyzing && (
          <button
            onClick={handleClear}
            className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-md bg-slate-800 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Analyze button */}
      <div className="mt-6 flex flex-col items-center gap-3">
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || text.trim().length < 10}
          className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 hover:from-blue-500 hover:to-blue-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none active:scale-[0.98]"
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
