"use client";

import { type Message, useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { SignInModal } from "~/components/sign-in-modal";
import { useRouter } from "next/navigation";
import { ChatMessage } from "~/components/chat-message";
import { AlertCircle, Square } from "lucide-react";
import { sanitizeUIMessagesAfterStop } from "./utils";

interface ChatProps {
  userName: string;
  isAuthenticated?: boolean;
  chatId: string;
  initialMessages: Message[];
  isNewChat: boolean;
}

export const ChatPage = ({
  userName,
  isAuthenticated = false,
  chatId,
  initialMessages,
  isNewChat,
}: ChatProps) => {
  const router = useRouter();

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    stop,
    setMessages,
  } = useChat({
    body: {
      chatId,
    },
    initialMessages,
    onFinish: () => {
      // TODO
      // if (isNewChat) {
      //   router.push(`/?chatId=${chatId}`);
      // }
    },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSignInModal, setShowSignInModal] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isLoading) {
      scrollToBottom();
    }
  }, [messages, error, isLoading]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setShowSignInModal(true);
      return;
    }
    handleSubmit(e);
  };

  const handleStop = () => {
    stop();
    setMessages(sanitizeUIMessagesAfterStop(messages));
  };

  return (
    <>
      <div className="flex flex-1 flex-col">
        <div
          className="mx-auto w-full max-w-[65ch] flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500"
          role="log"
          aria-label="Chat messages"
        >
          {messages.map((message, index) => {
            return (
              <ChatMessage
                key={index}
                reasoning={message.reasoning ?? ""}
                text={message.content}
                role={message.role}
                userName={userName}
                annotations={message.annotations as any}
              />
            );
          })}

          {error && (
            <div className="mx-auto w-full max-w-[65ch]">
              <div className="flex items-center gap-2 rounded-md bg-red-950 p-3 text-sm text-red-300">
                <AlertCircle className="size-5 shrink-0" />
                {error.message}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-700">
          <form
            onSubmit={handleFormSubmit}
            className="mx-auto max-w-[65ch] p-4"
          >
            <div className="flex gap-2">
              <input
                value={input}
                onChange={handleInputChange}
                placeholder="Say something..."
                autoFocus
                aria-label="Chat input"
                className="flex-1 rounded border border-gray-700 bg-gray-800 p-2 text-gray-200 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={isLoading ? handleStop : handleFormSubmit}
                disabled={false}
                className="rounded bg-gray-700 px-4 py-2 text-white hover:bg-gray-600 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:hover:bg-gray-700"
              >
                {isLoading ? <Square className="size-4" /> : "Send"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
      />
    </>
  );
};
