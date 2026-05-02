import axios from "axios";

const API_URL = "https://aura-ai-search.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

export async function sendQuery({ query, conversationId }) {
  const response = await api.post("/api/search", {
    query,
    conversation_id: conversationId || null,
  });
  return response.data;
}

export async function fetchConversations() {
  const response = await api.get("/api/conversations");
  return response.data;
}

export async function fetchConversation(id) {
  const response = await api.get(`/api/conversation/${id}`);
  return response.data;
}

export async function deleteConversation(id) {
  const response = await api.delete(`/api/conversation/${id}`);
  return response.data;
}

export default api;
