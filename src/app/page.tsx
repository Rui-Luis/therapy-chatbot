"use client";
import LoginForm from "@/components/LoginForm";
import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // <-- Add this
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
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Something went wrong. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage();
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
    setMessages([]);
    setInput("");
  }

  return (
    <main style={{ padding: "2rem", maxWidth: 600, margin: "0 auto" }}>
      {!isLoggedIn ? (
        <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />
      ) : (
        <>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem", textAlign: "center" }}>
            🧘 Therapy Chat
          </h1>

          <div
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              height: "400px",
              overflowY: "auto",
              marginBottom: "1rem",
            }}
          >
            {messages.map((msg, idx) => (
              <div key={idx} style={{ marginBottom: "1rem" }}>
                <strong>{msg.role === "user" ? "You" : "Therapist"}:</strong>
                <p style={{ margin: "0.5rem 0" }}>{msg.content}</p>
              </div>
            ))}
            {loading && <p><em>Therapist is thinking...</em></p>}
          </div>

          <form onSubmit={handleSubmit}>
            <textarea
              rows={3}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your thoughts here..."
              style={{ width: "100%", marginBottom: "1rem" }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />

            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
              <button type="submit" disabled={loading || !input.trim()}>
                Send
              </button>
              <button type="button" onClick={exportChat} disabled={messages.length === 0}>
                Export Chat
              </button>
              <button type="button" onClick={resetChat} disabled={messages.length === 0}>
                Reset
              </button>
            </div>
          </form>
        </>
      )}
    </main>
  );
}
