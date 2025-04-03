import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { auth } from "~/server/auth/index.ts";
import { ChatPage } from "./chat";
import { AuthButton } from "../components/auth-button.tsx";
import { getChat, getChats } from "~/server/db/queries";
import type { MessagePart } from "~/components/chat-message.tsx";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const session = await auth();
  const userName = session?.user?.name ?? "Guest";
  const isAuthenticated = !!session?.user;

  const currentChat =
    id && session?.user.id ? await getChat(session?.user?.id, id) : null;

  const chats = session?.user?.id ? await getChats(session.user.id) : [];

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Sidebar */}
      <div className="flex w-64 flex-col border-r border-gray-700 bg-gray-900">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-400">Your Chats</h2>
            {isAuthenticated && (
              <Link
                href="/"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                title="New Chat"
              >
                <PlusIcon className="size-5" />
              </Link>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className="group relative flex items-center justify-between rounded-lg p-2 hover:bg-gray-800"
            >
              <Link
                href={`/?id=${chat.id}`}
                className="flex-1 truncate text-sm text-gray-300"
              >
                {chat.title}
              </Link>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-700 p-4">
          <AuthButton
            isAuthenticated={isAuthenticated}
            userImage={session?.user?.image}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <ChatPage
          userName={userName}
          isAuthenticated={isAuthenticated}
          chatId={id}
          initialMessages={
            currentChat?.messages.map((message) => {
              return {
                id: message.id,
                content: "",
                role: message.role as "user" | "assistant",
                parts: message.parts as MessagePart[],
              };
            }) ?? []
          }
        />
      </div>
    </div>
  );
}
