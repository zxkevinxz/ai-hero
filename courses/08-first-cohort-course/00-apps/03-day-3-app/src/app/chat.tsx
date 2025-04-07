"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import type { Message } from "ai";
import { ChatMessage } from "~/components/chat-message";
import { SignInModal } from "~/components/sign-in-modal";
import { Send } from "lucide-react";
import { isNewChatCreated } from "~/utils";

interface ChatProps {
  userName: string;
  isAuthenticated: boolean;
  chatId?: string;
  initialMessages?: {
    id: string;
    chatId: string;
    role: string;
    parts: unknown;
    order: number;
    createdAt: Date;
  }[];
}

export const ChatPage = ({
  userName,
  isAuthenticated,
  chatId,
  initialMessages,
}: ChatProps) => {
  const router = useRouter();

  // Map database messages to the format expected by useChat
  const mappedInitialMessages = initialMessages?.map((msg) => ({
    id: msg.id,
    // msg.role is typed as string, so we need to cast it to the correct type
    role: msg.role as "user" | "assistant",
    // msg.parts is typed as unknown[], so we need to cast it to the correct type
    parts: msg.parts as Message["parts"],
    // content is not persisted, so we can safely pass an empty string
    content: "",
  }));

  const { messages, input, handleInputChange, handleSubmit, isLoading, data } =
    useChat({
      body: {
        chatId,
      },
      initialMessages: mappedInitialMessages,
    });

  // Check if the latest data item is a NEW_CHAT_CREATED object
  useEffect(() => {
    if (data && data.length > 0) {
      const latestData = data[data.length - 1];
      if (isNewChatCreated(latestData)) {
        router.push(`/?id=${latestData.chatId}`);
      }
    }
  }, [data, router]);

  return (
    <>
      <div className="flex flex-1 flex-col">
        <div
          className="mx-auto w-full max-w-[65ch] flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500"
          role="log"
          aria-label="Chat messages"
        >
          {messages.map((message) => {
            return (
              <ChatMessage
                key={message.id}
                parts={message.parts}
                role={message.role}
                userName={userName}
              />
            );
          })}
        </div>

        <div className="border-t border-gray-700">
          <form onSubmit={handleSubmit} className="mx-auto max-w-[65ch] p-4">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={handleInputChange}
                placeholder="Say something..."
                autoFocus
                aria-label="Chat input"
                className="flex-1 rounded border border-gray-700 bg-gray-800 p-2 text-gray-200 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
                disabled={!isAuthenticated}
              />
              <button
                type="submit"
                disabled={isLoading || !isAuthenticated}
                className="rounded bg-gray-700 px-4 py-2 text-white hover:bg-gray-600 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:hover:bg-gray-700"
              >
                <Send className="size-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {!isAuthenticated && <SignInModal />}
    </>
  );
};
