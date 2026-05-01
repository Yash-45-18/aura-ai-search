export function SourcesPanel({ sources }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-4 animate-fade-in">
      <p className="text-xs font-display font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
        Sources
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {sources.map((s, i) => (
          <a
            key={i}
            href={s.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60
              bg-white dark:bg-slate-800/50 hover:bg-sky-50 dark:hover:bg-sky-900/20
              hover:border-sky-300 dark:hover:border-sky-700
              transition-all duration-200 no-underline"
          >
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center text-[10px] font-bold text-sky-600 dark:text-sky-400 font-mono mt-0.5">
              {i + 1}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors leading-snug">
                {s.title}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5 font-mono">
                {s.source || s.link}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
