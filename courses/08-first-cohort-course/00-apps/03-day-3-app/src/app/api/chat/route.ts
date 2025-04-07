import type { Message } from "ai";
import {
  streamText,
  createDataStreamResponse,
  appendResponseMessages,
} from "ai";
import { model } from "~/models";
import { auth } from "~/server/auth";
import { searchSerper } from "~/serper";
import { z } from "zod";
import { upsertChat } from "~/server/db/queries";

export const maxDuration = 60;

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = (await request.json()) as {
    messages: Array<Message>;
    chatId?: string;
  };

  const { messages, chatId } = body;

  // Create a new chat if no chatId is provided
  const currentChatId = chatId ?? crypto.randomUUID();

  // Create or update the chat with initial messages
  await upsertChat({
    userId: session.user.id,
    chatId: currentChatId,
    title: messages[0]?.content ?? "New Chat",
    messages,
  });

  return createDataStreamResponse({
    execute: async (dataStream) => {
      // If there is no chatId, write data to indicate that a new chat has been created
      if (!chatId) {
        dataStream.writeData({
          type: "NEW_CHAT_CREATED",
          chatId: currentChatId,
        });
      }

      const result = streamText({
        model,
        messages,
        maxSteps: 10,
        system: `You are a helpful AI assistant with access to a web search tool. The current date and time is ${new Date().toLocaleString()}.
        
IMPORTANT INSTRUCTIONS:
1. ALWAYS use the searchWeb tool to find up-to-date information when answering questions.
2. ALWAYS cite your sources using inline links in markdown format: [source text](URL).
3. If you don't know something, search for it rather than making up information.
4. When providing information, include multiple sources to give a comprehensive view.
5. When users ask for up-to-date information, use the current date (${new Date().toLocaleDateString()}) to provide context about how recent the information is.
6. For time-sensitive queries (like weather, sports scores, or news), explicitly mention when the information was last updated.`,
        tools: {
          searchWeb: {
            parameters: z.object({
              query: z.string().describe("The query to search the web for"),
            }),
            execute: async ({ query }, { abortSignal }) => {
              const results = await searchSerper(
                { q: query, num: 10 },
                abortSignal,
              );

              return results.organic.map((result) => ({
                title: result.title,
                link: result.link,
                snippet: result.snippet,
              }));
            },
          },
        },
        onFinish: async ({ response }) => {
          const responseMessages = response.messages;
          const updatedMessages = appendResponseMessages({
            messages,
            responseMessages,
          });

          // Update the chat with all messages
          await upsertChat({
            userId: session.user.id,
            chatId: currentChatId,
            title: messages[0]?.content ?? "New Chat",
            messages: updatedMessages,
          });
        },
      });

      result.mergeIntoDataStream(dataStream);
    },
    onError: (e) => {
      console.error(e);
      return "Oops, an error occurred!";
    },
  });
}
