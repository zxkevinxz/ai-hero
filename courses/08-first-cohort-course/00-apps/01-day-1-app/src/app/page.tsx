import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "~/server/auth/index.ts";
import { getChatsByUserId, getFullChat } from "~/server/db/chat.ts";
import { ChatPage } from "./chat.tsx";
import { AuthButton } from "./components/auth-button.tsx";
import { DeleteChatButton } from "./components/delete-chat-button.tsx";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ chatId?: string }>;
}) {
  const session = await auth();
  const userName = session?.user?.name ?? "Guest";
  const isAuthenticated = !!session?.user;

  const paramsResult = await searchParams;

  const chatIdFromSearchParams = paramsResult.chatId;

  // Fetch user's chats if authenticated
  const chats =
    isAuthenticated && session.user.id
      ? await getChatsByUserId(session.user.id)
      : [];

  // Fetch current chat if there's a chatId
  const currentChat = chatIdFromSearchParams
    ? await getFullChat(chatIdFromSearchParams, session?.user?.id ?? "")
    : null;

  // Show 404 if chatId is provided but chat is not found
  if (chatIdFromSearchParams && !currentChat) {
    notFound();
  }

  const finalChatId = chatIdFromSearchParams ?? crypto.randomUUID();

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
                <PlusIcon className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
        <div className="-mt-1 flex-1 space-y-2 overflow-y-auto px-4 pt-1 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600">
          {chats.length > 0 ? (
            chats.map((chat) => (
              <div key={chat.id} className="flex items-center gap-2">
                <Link
                  href={`/?chatId=${chat.id}`}
                  className={`flex-1 rounded-lg p-3 text-left text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    chat.id === chatIdFromSearchParams
                      ? "bg-gray-700"
                      : "hover:bg-gray-750 bg-gray-800"
                  }`}
                >
                  {chat.title}
                </Link>
                <DeleteChatButton chatId={chat.id} />
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              {isAuthenticated
                ? "No chats yet. Start a new conversation!"
                : "Sign in to start chatting"}
            </p>
          )}
        </div>
        <div className="p-4">
          <AuthButton
            isAuthenticated={isAuthenticated}
            userImage={session?.user?.image}
          />
        </div>
      </div>

      <ChatPage
        key={finalChatId}
        isNewChat={!chatIdFromSearchParams}
        userName={userName}
        isAuthenticated={isAuthenticated}
        chatId={finalChatId}
        initialMessages={currentChat?.messages ?? []}
      />
    </div>
  );
}
