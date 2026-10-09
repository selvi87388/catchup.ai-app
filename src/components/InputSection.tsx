import { useState } from "react";
import { Zap, Trash2, Terminal } from "lucide-react";
import { SLACK_SAMPLE, WHATSAPP_SAMPLE, SPRINT_SYNC_SAMPLE } from "../sampleData";

interface InputSectionProps {
  onAnalyze: (text: string) => void;
  onClear: () => void;
  isAnalyzing: boolean;
}

export function LeftPanel({ onAnalyze, onClear, isAnalyzing }: InputSectionProps) {
  const [text, setText] = useState("");

  const handleClear = () => {
    setText("");
    onClear();
  };

  const handleAnalyze = () => {
    if (text.trim().length < 10) return;
    onAnalyze(text);
  };

  const chips: { label: string; sample: string }[] = [
    { label: "Team Slack", sample: SLACK_SAMPLE },
    { label: "WhatsApp Log", sample: WHATSAPP_SAMPLE },
    { label: "Sprint Sync", sample: SPRINT_SYNC_SAMPLE },
  ];

  return (
    <div className="rounded-lg border border-slate-800 bg-[#111620] h-full flex flex-col">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-mono font-semibold text-slate-400 tracking-wider uppercase">Raw Chat Log Chunk</span>
        </div>
        {text && !isAnalyzing && (
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-1 rounded text-[11px] font-medium text-slate-500 hover:text-slate-300 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Preset chips */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800/50">
        {chips.map((chip) => (
          <button
            key={chip.label}
            onClick={() => setText(chip.sample)}
            disabled={isAnalyzing}
            className="rounded-md border border-slate-800 bg-slate-900/40 px-2.5 py-1 text-[11px] font-medium text-slate-400 transition-all duration-150 hover:border-slate-700 hover:bg-slate-800/60 hover:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Textarea */}
      <div className="flex-1 px-4 py-3 min-h-0">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isAnalyzing}
          placeholder={"// Paste your group chat export here...\n//\n// Supported formats:\n//   [10:30 AM] Name: message\n//   10/9/26, 8:15 PM - Name: message\n//   Name: message\n//\n// Or click a preset chip above to load a demo."}
          className="w-full h-full min-h-[340px] rounded-md border border-slate-800 bg-[#0a0d12] p-4 text-[13px] text-slate-300 placeholder-slate-700 outline-none transition-all duration-200 resize-none focus:border-slate-700 disabled:opacity-50 font-mono leading-relaxed"
        />
      </div>

      {/* Action button */}
      <div className="px-4 pb-4 pt-1">
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || text.trim().length < 10}
          className="w-full inline-flex items-center justify-center gap-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-6 py-3 text-sm font-bold text-emerald-400 transition-all duration-200 hover:bg-emerald-500/15 hover:border-emerald-500/40 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Zap className="w-4 h-4" fill="currentColor" />
          {isAnalyzing ? "Running Pipeline..." : "Run Local Intelligence Pipeline"}
        </button>
        {text.trim().length < 10 && !isAnalyzing && (
          <p className="text-[11px] text-slate-700 text-center mt-2 font-mono">
            // Waiting for input data...
          </p>
        )}
      </div>
    </div>
  );
}
