import { useState, useCallback, useRef } from "react";
import { sendQuery } from "../utils/api";
import toast from "react-hot-toast";

export function useSearch() {
  const [messages, setMessages] = useState([]); // {role, content, sources, timestamp}
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const abortRef = useRef(null);

  const search = useCallback(
    async (query) => {
      if (!query.trim() || isLoading) return;

      const userMsg = {
        id: Date.now(),
        role: "user",
        content: query,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const data = await sendQuery({ query, conversationId });
        setConversationId(data.conversation_id);

        const assistantMsg = {
          id: Date.now() + 1,
          role: "assistant",
          content: data.answer,
          sources: data.sources || [],
          timestamp: data.timestamp,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        const errMsg = err.response?.data?.error || err.message || "Something went wrong";
        toast.error(errMsg);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "error",
            content: errMsg,
            timestamp: new Date().toISOString(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId, isLoading]
  );

  const reset = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    setIsLoading(false);
  }, []);

  return { messages, isLoading, conversationId, search, reset };
}
