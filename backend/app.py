from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from groq import Groq
from duckduckgo_search import DDGS
from datetime import datetime
import uuid

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# In-memory conversation store
conversations = {}


def search_web(query: str) -> list:
    """Free DuckDuckGo search — no API key needed."""
    try:
        results = []
        with DDGS() as ddgs:
            for r in ddgs.text(query, max_results=6):
                results.append({
                    "title": r.get("title", ""),
                    "link": r.get("href", ""),
                    "snippet": r.get("body", ""),
                    "source": r.get("href", ""),
                })
        return results
    except Exception as e:
        print(f"Search error: {e}")
        return []


def build_system_prompt(search_results: list) -> str:
    sources_text = ""
    for i, result in enumerate(search_results, 1):
        sources_text += f"\n[{i}] {result['title']}\nURL: {result['link']}\n{result['snippet']}\n"

    return f"""You are Lumina, an advanced AI search assistant that combines real-time web search with deep reasoning to provide accurate, well-cited answers.

You have access to the following fresh web search results:
{sources_text if sources_text else "No web search results available. Answer from your training knowledge."}

INSTRUCTIONS:
1. Synthesize the search results into a clear, helpful answer
2. Use markdown formatting: **bold**, bullet points, headers where appropriate
3. When citing information from results, add inline citations like [1], [2], etc.
4. Be conversational yet informative
5. Keep answers focused and avoid unnecessary padding"""


def ask_llm(messages: list, search_results: list) -> str:
    system_prompt = build_system_prompt(search_results)
    try:
        response = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "system", "content": system_prompt}] + messages,
            max_tokens=2048,
            temperature=0.7,
        )
        return response.choices[0].message.content
    except Exception as e:
        raise RuntimeError(f"LLM error: {str(e)}")


@app.route("/api/search", methods=["POST"])
def search():
    data = request.get_json()
    if not data or not data.get("query"):
        return jsonify({"error": "Query is required"}), 400

    query = data["query"].strip()
    conversation_id = data.get("conversation_id") or str(uuid.uuid4())

    if conversation_id not in conversations:
        conversations[conversation_id] = {
            "id": conversation_id,
            "messages": [],
            "created_at": datetime.utcnow().isoformat(),
        }

    conv = conversations[conversation_id]
    search_results = search_web(query)
    conv["messages"].append({"role": "user", "content": query})
    recent_messages = conv["messages"][-10:]

    try:
        answer = ask_llm(recent_messages, search_results)
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500

    conv["messages"].append({"role": "assistant", "content": answer})

    return jsonify({
        "answer": answer,
        "sources": search_results,
        "conversation_id": conversation_id,
        "timestamp": datetime.utcnow().isoformat(),
    })


@app.route("/api/conversations", methods=["GET"])
def list_conversations():
    convs = [
        {
            "id": c["id"],
            "created_at": c["created_at"],
            "preview": c["messages"][0]["content"][:80] if c["messages"] else ""
        }
        for c in conversations.values()
    ]
    convs.sort(key=lambda x: x["created_at"], reverse=True)
    return jsonify(convs[:20])


@app.route("/api/conversation/<conversation_id>", methods=["GET"])
def get_conversation(conversation_id):
    conv = conversations.get(conversation_id)
    if not conv:
        return jsonify({"error": "Conversation not found"}), 404
    return jsonify(conv)


@app.route("/api/conversation/<conversation_id>", methods=["DELETE"])
def delete_conversation(conversation_id):
    if conversation_id in conversations:
        del conversations[conversation_id]
        return jsonify({"success": True})
    return jsonify({"error": "Not found"}), 404


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model": "llama-3.1-8b-instant"})


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(debug=True, host="0.0.0.0", port=port)