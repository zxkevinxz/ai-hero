import type { Message } from "ai";
import { eq } from "drizzle-orm";
import { db } from "./index.ts";
import { chats, type DB, messages } from "./schema.ts";

export type SaveChatParams = {
  id: string;
  userId: string;
  title: string;
  messages: Array<{
    id: string;
    content: string;
    role: string;
    parts?: unknown;
  }>;
};

export async function saveChat({
  id,
  userId,
  title,
  messages: chatMessages,
}: SaveChatParams) {
  return await db.transaction(async (tx) => {
    // Insert the chat
    await tx.insert(chats).values({
      id,
      userId,
      title,
    });

    // Insert all messages
    if (chatMessages.length > 0) {
      await tx.insert(messages).values(
        chatMessages.map((message) => ({
          id: message.id,
          chatId: id,
          content: message.content,
          role: message.role,
          parts: message.parts,
        })),
      );
    }

    return { id };
  });
}

type ChatWithOwnership = {
  chat: DB.Chat | undefined;
  isOwner: boolean;
};

export async function getChatById({
  id,
  userId,
}: {
  id: string;
  userId: string;
}): Promise<ChatWithOwnership> {
  const chat = await db.query.chats.findFirst({
    where: eq(chats.id, id),
    with: {
      messages: {
        orderBy: (messages, { asc }) => [asc(messages.order)],
      },
    },
  });

  return {
    chat,
    isOwner: chat ? chat.userId === userId : false,
  };
}

export type SaveMessageParams = {
  id: string;
  chatId: string;
  content: unknown;
  role: string;
};

export async function saveMessage(message: SaveMessageParams) {
  return await db.insert(messages).values(message);
}

export type OverwriteChatMessagesOpts = {
  chatId: string;
  messages: Array<{
    id: string;
    content: unknown;
    role: string;
    parts?: unknown;
  }>;
};

export async function overwriteChatMessages(opts: OverwriteChatMessagesOpts) {
  return await db.transaction(async (tx) => {
    // Delete existing messages first
    await tx.delete(messages).where(eq(messages.chatId, opts.chatId));

    // Insert new messages
    await tx
      .insert(messages)
      .values(opts.messages.map((m) => ({ ...m, chatId: opts.chatId })));
  });
}

export type ChatListItem = {
  id: string;
  title: string;
};

export async function getChatsByUserId(
  userId: string,
): Promise<ChatListItem[]> {
  const userChats = await db.query.chats.findMany({
    where: eq(chats.userId, userId),
    columns: {
      id: true,
      title: true,
    },
    orderBy: (chats, { desc }) => [desc(chats.updatedAt)],
  });

  return userChats;
}

export type Chat = {
  id: string;
  title: string;
  messages: Message[];
};

export async function getFullChat(
  chatId: string,
  userId: string,
): Promise<Chat | undefined> {
  const chat = await db.query.chats.findFirst({
    where: (chats, { and, eq }) =>
      and(eq(chats.id, chatId), eq(chats.userId, userId)),
    columns: {
      id: true,
      title: true,
    },
    with: {
      messages: {
        columns: {
          id: true,
          content: true,
          role: true,
          parts: true,
          createdAt: true,
        },
        orderBy: (messages, { asc }) => [asc(messages.order)],
      },
    },
  });

  if (!chat) return undefined;

  return {
    ...chat,
    messages: chat.messages.map((m) => {
      return {
        ...m,
        content: m.content as any,
        role: m.role as any,
        parts: m.parts as any,
      };
    }),
  };
}

export async function deleteChatById(chatId: string, userId: string) {
  try {
    const chat = await db.query.chats.findFirst({
      where: (chats, { and, eq }) =>
        and(eq(chats.id, chatId), eq(chats.userId, userId)),
    });

    if (!chat) {
      return {
        success: false,
        error: "Chat not found or you don't have permission to delete it",
      };
    }

    await db.transaction(async (tx) => {
      // Delete all messages first due to foreign key constraint
      await tx.delete(messages).where(eq(messages.chatId, chatId));
      // Then delete the chat
      await tx.delete(chats).where(eq(chats.id, chatId));
    });

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Failed to delete chat",
    };
  }
}
