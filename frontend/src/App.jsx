import { useEffect, useRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useSearch } from "./hooks/useSearch";
import { SearchBar } from "./components/SearchBar";
import { MessageBubble } from "./components/MessageBubble";
import { ThinkingDots } from "./components/ThinkingDots";
import { Sidebar } from "./components/Sidebar";
import { HeroEmpty } from "./components/HeroEmpty";
import { fetchConversation } from "./utils/api";
import "./styles/globals.css";

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("lumina-theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const bottomRef = useRef(null);
  const { messages, isLoading, conversationId, search, reset } = useSearch();

  // Apply dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("lumina-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSelectConversation = async (id) => {
    setSidebarOpen(false);
    // Could load conversation and replay — for now just close sidebar
  };

  return (
    <div className={`flex h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-sky-50/40
      dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden font-body`}>

      {/* Sidebar */}
      <Sidebar
        currentId={conversationId}
        onNewChat={() => { reset(); setSidebarOpen(false); }}
        onSelectConversation={handleSelectConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top nav */}
        <header className="flex items-center justify-between px-4 py-3
          border-b border-slate-200/60 dark:border-slate-800/60
          bg-white/60 dark:bg-slate-900/60 backdrop-blur-md flex-shrink-0">

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800
                text-slate-500 dark:text-slate-400 transition-colors lg:hidden"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-sky-400 to-violet-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
                </svg>
              </div>
              <span className="font-display font-bold text-slate-800 dark:text-white text-sm tracking-tight">
                Aura
              </span>
              <span className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900/40
                text-sky-600 dark:text-sky-400 font-mono font-medium border border-sky-200 dark:border-sky-800/50">
                AI Search
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                onClick={reset}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg
                  text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200
                  hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-body"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                New
              </button>
            )}

            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="relative w-10 h-5.5 rounded-full transition-colors duration-300 p-0.5 flex items-center
                bg-slate-200 dark:bg-sky-600 focus:outline-none"
            >
              <span className={`w-4 h-4 rounded-full bg-white shadow transition-transform duration-300
                flex items-center justify-center text-[9px]
                ${darkMode ? "translate-x-5" : "translate-x-0"}`}>
                {darkMode ? "🌙" : "☀️"}
              </span>
            </button>
          </div>
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-3xl mx-auto">
            {messages.length === 0 ? (
              <HeroEmpty />
            ) : (
              <div className="space-y-6 pb-4">
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
                {isLoading && (
                  <div className="flex animate-slide-up">
                    <div className="bg-white dark:bg-slate-800/70 rounded-2xl rounded-tl-sm px-6 py-4
                      border border-slate-200/80 dark:border-slate-700/50 shadow-sm">
                      <ThinkingDots />
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            )}
          </div>
        </main>

        {/* Search input */}
        <footer className="flex-shrink-0 px-4 py-4 border-t border-slate-200/60 dark:border-slate-800/60
          bg-white/60 dark:bg-slate-900/60 backdrop-blur-md">
          <div className="max-w-3xl mx-auto">
            <SearchBar
              onSearch={search}
              isLoading={isLoading}
              hasMessages={messages.length > 0}
            />
          </div>
        </footer>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          className: "font-body text-sm !bg-white dark:!bg-slate-800 !text-slate-800 dark:!text-slate-100 !shadow-xl",
          duration: 3000,
        }}
      />
    </div>
  );
}
