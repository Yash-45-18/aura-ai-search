export function HeroEmpty() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 text-center px-4 py-16 animate-fade-in">
      {/* Logo */}
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-sky-400 via-sky-500 to-violet-600
          flex items-center justify-center shadow-2xl shadow-sky-500/30">
          <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
          </svg>
        </div>
        {/* Glow ring */}
        <div className="absolute -inset-2 rounded-[28px] bg-gradient-to-br from-sky-400 to-violet-600 opacity-20 blur-xl -z-10" />
      </div>

      <h1 className="font-display text-5xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
        Aura
      </h1>
      <p className="text-lg text-slate-500 dark:text-slate-400 max-w-md font-body leading-relaxed mb-2">
       AI-powered search that glows with knowledge
      </p>
      <p className="text-sm text-slate-400 dark:text-slate-600 font-body">
        Real-time web search · Claude AI · Cited answers
      </p>

      {/* Feature badges */}
      <div className="flex flex-wrap justify-center gap-2 mt-8">
        {[
          { icon: "🌐", label: "Live Web Search" },
          { icon: "🧠", label: "Claude AI" },
          { icon: "📎", label: "Cited Sources" },
          { icon: "💬", label: "Conversational" },
        ].map((f) => (
          <span key={f.label}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-medium
              bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60
              text-slate-600 dark:text-slate-300 shadow-sm">
            <span>{f.icon}</span>
            {f.label}
          </span>
        ))}
      </div>
    </div>
  );
}
