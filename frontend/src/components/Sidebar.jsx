import { useEffect, useState } from "react";
import { fetchConversations, deleteConversation } from "../utils/api";

export function Sidebar({ currentId, onNewChat, onSelectConversation, isOpen, onClose }) {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    if (isOpen) loadConversations();
  }, [isOpen]);

  const loadConversations = async () => {
    try {
      const data = await fetchConversations();
      setConversations(data);
    } catch {}
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    await deleteConversation(id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-72 z-40 flex flex-col
        bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:z-auto`}>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-400 to-violet-500 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
              </svg>
            </div>
            <span className="font-display font-bold text-slate-800 dark:text-white">Aura</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* New Chat */}
        <div className="p-3">
          <button
            onClick={onNewChat}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl
              bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 font-body font-medium text-sm
              hover:bg-sky-100 dark:hover:bg-sky-900/50 border border-sky-200 dark:border-sky-800/50
              transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Search
          </button>
        </div>

        {/* History */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {conversations.length === 0 ? (
            <p className="text-xs text-slate-400 dark:text-slate-600 text-center py-8 font-body">
              No search history yet
            </p>
          ) : (
            <>
              <p className="text-[10px] font-display font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-600 px-2 pb-1">
                Recent
              </p>
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer
                    transition-all duration-150 font-body text-sm
                    ${currentId === conv.id
                      ? "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300"
                      : "hover:bg-slate-200/60 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300"
                    }`}
                >
                  <svg className="w-3.5 h-3.5 flex-shrink-0 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="flex-1 truncate text-xs">{conv.preview || "Search"}</span>
                  <button
                    onClick={(e) => handleDelete(e, conv.id)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:text-red-500 transition-all"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <p className="text-[10px] text-slate-400 dark:text-slate-600 text-center font-body">
            Powered by Claude + Web Search
          </p>
        </div>
      </aside>
    </>
  );
}
