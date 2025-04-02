import { google } from "@ai-sdk/google";
import {
  type DataStreamWriter,
  type Message,
  appendResponseMessages,
  createDataStreamResponse,
  generateText,
  simulateReadableStream,
} from "ai";
import dedent from "dedent";
import { and, eq, gte, sql } from "drizzle-orm";
import { auth } from "~/server/auth/index.ts";
import { db } from "~/server/db/index.ts";
import {
  getChatById,
  overwriteChatMessages,
  saveChat,
} from "~/server/db/chat.ts";
import { requests } from "~/server/db/schema.ts";
import { createDataStreamWritable } from "./agent/create-data-stream-writable";
import { runAgent } from "./agent/main";

export const maxDuration = 60;

const MAX_REQUESTS_PER_DAY = 10;

async function generateChatTitle(message: string): Promise<string> {
  const { text } = await generateText({
    model: google("gemini-2.0-flash-lite-preview-02-05"),
    system: dedent`
      You will be passed a message and asked to generate a
      title for a chat based on the message.

      Return only the title.

      Example:

      Message: "Hello, how can I help you today?"
      Title: "Customer Support"

      Message: "I'm looking for a new laptop."
      Title: "Laptop Shopping"

      Message: "I'm feeling a bit down today."
      Title: "Mental Health"

      Message: "I'm looking for a new job."
      Title: "Job Search"
    `,
    prompt: message,
  });

  return text;
}

async function hasUserExceededRateLimit(userId: string): Promise<boolean> {
  // Run both queries in parallel
  const [user, recentRequests] = await Promise.all([
    db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
    }),
    db
      .select({ count: sql<number>`count(*)` })
      .from(requests)
      .where(
        and(
          eq(requests.userId, userId),
          gte(requests.createdAt, new Date(new Date().setUTCHours(0, 0, 0, 0))),
        ),
      ),
  ]);

  // Admins have unlimited requests
  if (user?.isAdmin) {
    return false;
  }

  return (recentRequests[0]?.count ?? 0) >= MAX_REQUESTS_PER_DAY;
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    chatId: string;
    messages: Array<Message>;
  };

  const userMessage = body.messages
    .filter((message) => message.role === "user")
    .at(-1);

  if (!userMessage) {
    return new Response("Bad Request", { status: 400 });
  }

  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (await hasUserExceededRateLimit(session.user.id)) {
    return new Response(
      "Too Many Requests - Daily limit exceeded. Please try again tomorrow.",
      { status: 429 },
    );
  }

  const chatId = body.chatId;

  // Check if chat exists and verify ownership
  const { chat, isOwner } = await getChatById({
    id: chatId,
    userId: session.user.id,
  });

  // Return 404 if the user doesn't own the chat
  if (chat && !isOwner) {
    return new Response("Not Found", { status: 404 });
  }

  return createDataStreamResponse({
    execute: async (dataStream) => {
      await runAgent({
        messages: body.messages,
        dataStream,
        tokenBudget: 100_000,
      });

      // if (!chat) {
      //   // Generate a title for the chat
      //   const title = await generateChatTitle(userMessage.content);

      //   // Create a new chat
      //   await saveChat({
      //     id: chatId,
      //     title,
      //     userId: session.user.id,
      //     messages: [], // TODO
      //   });
      // }
    },
    onError: (e) => {
      console.error(e);
      return "Oops, an error occured!";
    },
  });
}

// export async function DELETE(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const id = searchParams.get("id");

//   if (!id) {
//     return new Response("Not Found", { status: 404 });
//   }

//   const session = await auth();

//   if (!session || !session.user) {
//     return new Response("Unauthorized", { status: 401 });
//   }

//   try {
//     const chat = await getChatById({ id });

//     if (chat.userId !== session.user.id) {
//       return new Response("Unauthorized", { status: 401 });
//     }

//     await deleteChatById({ id });

//     return new Response("Chat deleted", { status: 200 });
//   } catch (error) {
//     return new Response("An error occurred while processing your request", {
//       status: 500,
//     });
//   }
// }
