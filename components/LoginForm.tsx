"use client";

import { useState } from "react";

type Props = {
  onLoginSuccess: () => void;
};

export default function LoginForm({ onLoginSuccess }: Props) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const correctCode = process.env.NEXT_PUBLIC_ACCESS_CODE || "opensesame";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim() === correctCode) {
      localStorage.setItem("access_granted", "true");
      onLoginSuccess();
    } else {
      setError("Invalid code. Please ask Rui for access.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md max-w-sm w-full"
      >
        <h2 className="text-xl font-semibold mb-4">Enter Access Code</h2>
        <input
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Access code..."
          className="w-full border px-3 py-2 rounded mb-3"
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Enter
        </button>
        <p className="text-xs text-gray-500 mt-3">
          You must be invited by Rui to use this chatbot.
        </p>
      </form>
    </div>
  );
}
