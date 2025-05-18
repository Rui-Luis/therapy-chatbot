import React from "react";

type Props = {
  role: "user" | "assistant";
  content: string;
};

export default function MessageBubble({ role, content }: Props) {
  const isUser = role === "user";

  return (
    <div
      className={`max-w-[80%] my-2 p-3 rounded-lg shadow text-sm whitespace-pre-wrap ${
        isUser
          ? "ml-auto bg-blue-100 text-right text-blue-800"
          : "mr-auto bg-gray-100 text-left text-gray-800"
      }`}
    >
      <strong>{isUser ? "You" : "Therapist"}:</strong> {content}
    </div>
  );
}
