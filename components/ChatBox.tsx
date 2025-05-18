"use client";

import { useState } from "react";
import MessageBubble from "./MessageBubble";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const newMessages: Message[] = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch (err) {
              console.error(err);
      setMessages([...newMessages, { role: "assistant", content: "Something went wrong. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  }

  function exportChat() {
    const text = messages
      .map((msg) => `${msg.role === "user" ? "You" : "Therapist"}: ${msg.content}`)
      .join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "therapy-chat.txt";
    link.click();
  }

  function resetChat() {
    if (confirm("Are you sure you want to clear the conversation?")) {
      setMessages([]);
      setInput("");
    }
  }

  return (
    <div style={{ padding: "2rem", maxWidth: 600, margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>🧘 Therapy Chat</h1>

      <div style={{ border: "1px solid #ccc", padding: "1rem", height: "400px", overflowY: "auto", marginBottom: "1rem" }}>
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} role={msg.role} content={msg.content} />
        ))}
        {loading && <p><em>Therapist is thinking...</em></p>}
      </div>

      <textarea
        rows={3}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your thoughts here..."
        style={{ width: "100%", marginBottom: "1rem" }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
        <button onClick={sendMessage} disabled={loading || !input.trim()}>
          Send
        </button>
        <button onClick={exportChat} disabled={messages.length === 0}>
          Export Chat
        </button>
        <button onClick={resetChat} disabled={messages.length === 0}>
          Reset Chat
        </button>
      </div>
    </div>
  );
}
