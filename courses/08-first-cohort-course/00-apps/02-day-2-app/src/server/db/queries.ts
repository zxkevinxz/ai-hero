import { and, desc, eq } from "drizzle-orm";
import type { Message } from "ai";

import { db } from "~/server/db";
import { chats, messages, type DB } from "~/server/db/schema";

/**
 * Create or update a chat with all its messages
 * If the chat already exists, it will delete all existing messages and replace them with the new ones
 * If the chat does not exist, it will create a new chat with the id passed in
 */
export const upsertChat = async (opts: {
  userId: string;
  chatId: string;
  title: string;
  messages: Message[];
}) => {
  const { userId, chatId, title, messages: chatMessages } = opts;

  // Check if the chat exists and belongs to the user
  const existingChat = await db.query.chats.findFirst({
    where: and(eq(chats.id, chatId), eq(chats.userId, userId)),
  });

  // If the chat exists, delete all existing messages
  if (existingChat) {
    await db.delete(messages).where(eq(messages.chatId, chatId));

    // Update the chat title and updatedAt timestamp
    await db
      .update(chats)
      .set({
        title,
        updatedAt: new Date(),
      })
      .where(eq(chats.id, chatId));
  } else {
    // Create a new chat
    await db.insert(chats).values({
      id: chatId,
      userId,
      title,
    });
  }

  // Insert all messages
  if (chatMessages.length > 0) {
    await db.insert(messages).values(
      chatMessages.map((message, index) => ({
        id: message.id,
        chatId,
        role: message.role,
        parts: message.parts,
        order: index,
      })),
    );
  }

  return { id: chatId };
};

/**
 * Get a chat by id with its messages
 */
export const getChat = async (chatId: string, userId: string) => {
  const chat = await db.query.chats.findFirst({
    where: and(eq(chats.id, chatId), eq(chats.userId, userId)),
    with: {
      messages: {
        orderBy: [messages.order],
      },
    },
  });

  if (!chat) {
    return null;
  }

  return chat;
};

/**
 * Get all chats for a user, without the messages
 */
export const getChats = async (userId: string) => {
  const userChats = await db.query.chats.findMany({
    where: eq(chats.userId, userId),
    orderBy: [desc(chats.updatedAt)],
  });

  return userChats;
};
