import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import { SourcesPanel } from "./SourcesPanel";
import toast from "react-hot-toast";

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={copy}
      title="Copy answer"
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg
        bg-slate-100 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400
        hover:bg-slate-200 dark:hover:bg-slate-600 transition-all font-body"
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

const markdownComponents = {
  h1: ({ children }) => (
    <h1 className="text-xl font-display font-bold text-slate-900 dark:text-white mt-4 mb-2">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-lg font-display font-semibold text-slate-800 dark:text-slate-100 mt-3 mb-2">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-display font-semibold text-slate-700 dark:text-slate-200 mt-2 mb-1">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed mb-3 font-body">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-none space-y-1.5 mb-3 pl-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside space-y-1.5 mb-3 pl-2">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="flex items-start gap-2 text-[15px] text-slate-700 dark:text-slate-300 font-body">
      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0"></span>
      <span>{children}</span>
    </li>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-slate-900 dark:text-white">{children}</strong>
  ),
  code: ({ inline, children }) =>
    inline ? (
      <code className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-sky-600 dark:text-sky-400 text-[13px] font-mono">
        {children}
      </code>
    ) : (
      <pre className="bg-slate-900 dark:bg-black rounded-xl p-4 overflow-x-auto mb-3 border border-slate-700">
        <code className="text-sm font-mono text-slate-200">{children}</code>
      </pre>
    ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-sky-400 pl-4 italic text-slate-600 dark:text-slate-400 my-3 font-body">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="text-sky-500 hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300 underline underline-offset-2">
      {children}
    </a>
  ),
};

export function MessageBubble({ message }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end animate-slide-up">
        <div className="max-w-[80%] px-5 py-3.5 rounded-2xl rounded-tr-sm
          bg-gradient-to-br from-sky-500 to-sky-600 dark:from-sky-600 dark:to-sky-700
          text-white shadow-lg shadow-sky-500/20">
          <p className="text-[15px] font-body leading-relaxed">{message.content}</p>
        </div>
      </div>
    );
  }

  if (message.role === "error") {
    return (
      <div className="flex animate-slide-up">
        <div className="max-w-[85%] px-5 py-4 rounded-2xl rounded-tl-sm
          bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400 font-body">⚠️ {message.content}</p>
        </div>
      </div>
    );
  }

  // Assistant
  return (
    <div className="flex animate-slide-up">
      <div className="w-full max-w-[90%]">
        {/* Aura Avatar + label */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-400 to-violet-500 flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
            </svg>
          </div>
          <span className="text-xs font-display font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Aura
          </span>
          <span className="text-xs text-slate-300 dark:text-slate-600">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        {/* Content card */}
        <div className="bg-white dark:bg-slate-800/70 rounded-2xl rounded-tl-sm px-6 py-5
          border border-slate-200/80 dark:border-slate-700/50 shadow-sm">
          <div className="prose-sm max-w-none">
            <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>

          {/* Sources */}
          {message.sources && message.sources.length > 0 && (
            <SourcesPanel sources={message.sources} />
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50">
            <CopyButton text={message.content} />
          </div>
        </div>
      </div>
    </div>
  );
}
