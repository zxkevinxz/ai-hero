"use client";

import { useChat } from "ai/react";

export default function Page() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
  } = useChat();

  return (
    <div className="mx-auto max-w-[60ch] flex flex-col gap-4 py-6">
      {messages.map((message) => (
        <div key={message.id}>{message.content}</div>
      ))}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3"
      >
        <input
          className="flex-grow"
          value={input}
          onChange={handleInputChange}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
