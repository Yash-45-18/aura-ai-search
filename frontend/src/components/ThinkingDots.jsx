export function ThinkingDots() {
  return (
    <div className="flex items-center gap-1.5 py-2">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-sky-400 dark:bg-sky-400 inline-block"
          style={{
            animation: `bounceDot 1.4s ease-in-out infinite`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
      <span className="ml-2 text-sm text-slate-400 font-body animate-pulse">
        Lumina is thinking...
      </span>
    </div>
  );
}
