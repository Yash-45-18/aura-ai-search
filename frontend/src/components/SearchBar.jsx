import { useState, useRef, useEffect } from "react";

const SUGGESTIONS = [
  "What is quantum computing?",
  "Latest breakthroughs in AI research",
  "How does the stock market work?",
  "Best practices for React development",
  "Climate change solutions 2024",
];

export function SearchBar({ onSearch, isLoading, hasMessages }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  }, [value]);

  const submit = () => {
    const q = value.trim();
    if (!q || isLoading) return;
    onSearch(q);
    setValue("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className={`w-full transition-all duration-500 ${hasMessages ? "" : "max-w-2xl mx-auto"}`}>
      {/* Suggestion pills — only on empty state */}
      {!hasMessages && (
        <div className="flex flex-wrap justify-center gap-2 mb-5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => onSearch(s)}
              className="px-3.5 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-700
                bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300
                hover:border-sky-300 dark:hover:border-sky-600 hover:text-sky-600 dark:hover:text-sky-400
                backdrop-blur-sm transition-all duration-200 font-body"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input box */}
      <div className="relative flex items-end gap-3 p-3 rounded-2xl
        bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60
        shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50
        focus-within:border-sky-400 dark:focus-within:border-sky-500
        focus-within:shadow-sky-100 dark:focus-within:shadow-sky-900/30
        transition-all duration-200 backdrop-blur-sm">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          disabled={isLoading}
          rows={1}
          placeholder="Ask anything..."
          className="flex-1 resize-none bg-transparent text-slate-800 dark:text-slate-100
            placeholder-slate-400 dark:placeholder-slate-500 text-[15px] font-body
            outline-none leading-relaxed py-1.5 px-1 min-h-[40px] max-h-[160px]
            disabled:opacity-50"
        />

        <button
          onClick={submit}
          disabled={!value.trim() || isLoading}
          className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center
            bg-gradient-to-br from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500
            disabled:from-slate-300 disabled:to-slate-400 dark:disabled:from-slate-600 dark:disabled:to-slate-700
            text-white shadow-md shadow-sky-500/30 disabled:shadow-none
            transition-all duration-200 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          )}
        </button>
      </div>
      <p className="text-center text-[11px] text-slate-400 dark:text-slate-600 mt-2 font-body">
        Press <kbd className="font-mono bg-slate-100 dark:bg-slate-700 px-1 rounded text-[10px]">Enter</kbd> to search · <kbd className="font-mono bg-slate-100 dark:bg-slate-700 px-1 rounded text-[10px]">Shift+Enter</kbd> for new line
      </p>
    </div>
  );
}
