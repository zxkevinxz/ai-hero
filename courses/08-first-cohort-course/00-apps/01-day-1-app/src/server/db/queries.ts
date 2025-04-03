import { and, eq } from "drizzle-orm";
import { db } from "./index";
import { chats, messages } from "./schema";
import type { DB } from "./schema";

export async function upsertChat(
  userId: string,
  chatId: string,
  title: string,
  newMessages: Omit<DB.NewMessage, "chatId" | "id" | "order">[],
) {
  // Check if chat exists and belongs to user
  const existingChat = await db.query.chats.findFirst({
    where: and(eq(chats.id, chatId), eq(chats.userId, userId)),
  });

  if (existingChat) {
    // Delete existing messages
    await db.delete(messages).where(eq(messages.chatId, chatId));

    // Update chat title
    await db
      .update(chats)
      .set({ title, updatedAt: new Date() })
      .where(eq(chats.id, chatId));
  } else {
    // Create new chat
    await db.insert(chats).values({
      id: chatId,
      userId,
      title,
    });
  }

  // Insert new messages with order
  const messagesToInsert = newMessages.map((msg, index) => ({
    ...msg,
    id: crypto.randomUUID(),
    chatId,
    order: index,
  }));

  await db.insert(messages).values(messagesToInsert);

  return chatId;
}

export async function appendMessages(
  userId: string,
  chatId: string,
  newMessages: Omit<DB.NewMessage, "chatId" | "id" | "order">[],
) {
  // Verify chat belongs to user
  const chat = await db.query.chats.findFirst({
    where: and(eq(chats.id, chatId), eq(chats.userId, userId)),
  });

  if (!chat) {
    throw new Error("Chat not found or does not belong to user");
  }

  // Get the highest order number
  const lastMessage = await db.query.messages.findFirst({
    where: eq(messages.chatId, chatId),
    orderBy: (messages, { desc }) => [desc(messages.order)],
  });

  const startOrder = lastMessage ? lastMessage.order + 1 : 0;

  // Insert new messages with order
  const messagesToInsert = newMessages.map((msg, index) => ({
    ...msg,
    id: crypto.randomUUID(),
    chatId,
    order: startOrder + index,
  }));

  await db.insert(messages).values(messagesToInsert);
}

export async function getChat(userId: string, chatId: string) {
  const chat = await db.query.chats.findFirst({
    where: and(eq(chats.id, chatId), eq(chats.userId, userId)),
    with: {
      messages: {
        orderBy: (messages, { asc }) => [asc(messages.order)],
      },
    },
  });

  if (!chat) {
    throw new Error("Chat not found or does not belong to user");
  }

  return chat;
}

export async function getChats(userId: string) {
  return db.query.chats.findMany({
    where: eq(chats.userId, userId),
    orderBy: (chats, { desc }) => [desc(chats.updatedAt)],
  });
}
