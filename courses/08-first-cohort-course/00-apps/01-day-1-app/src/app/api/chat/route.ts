import type { Message } from "ai";
import {
  appendResponseMessages,
  createDataStreamResponse,
  streamText,
} from "ai";
import { z } from "zod";
import { model } from "~/models";
import { searchSerper } from "~/serper";
import { auth } from "~/server/auth";
import { upsertChat } from "~/server/db/queries";

export const maxDuration = 60;

const systemPrompt = `You are a helpful AI assistant with the ability to search the web for real-time information. You should:

1. ALWAYS use the searchWeb tool when answering questions that might require current or factual information
2. ALWAYS cite your sources using inline links in markdown format like [source text](url)
3. If you're not sure about something, search for it rather than making assumptions
4. When searching, try to be specific and targeted in your queries
5. After searching, synthesize the information in a clear and concise way

Remember to:
- Use the searchWeb tool proactively
- Always cite sources with inline links
- Be transparent about where your information comes from
- If you can't find specific information, say so rather than making assumptions`;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages, chatId } = (await req.json()) as {
    messages: Message[];
    chatId?: string;
  };

  const newChatId = chatId ?? crypto.randomUUID();

  if (!chatId) {
    await upsertChat(
      session.user.id,
      newChatId,
      messages[messages.length - 1]?.content?.slice(0, 100) ?? "New Chat",
      messages.map((msg) => ({
        role: msg.role,
        parts: msg.parts ?? [],
      })),
    );
  }

  return createDataStreamResponse({
    async execute(dataStream) {
      if (!chatId) {
        dataStream.writeData({
          type: "NEW_CHAT_CREATED",
          chatId: newChatId,
        });
      }

      const result = streamText({
        model,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        maxSteps: 10,
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

          // Save the messages to the database
          await upsertChat(
            session.user.id,
            newChatId,
            messages[messages.length - 1]?.content?.slice(0, 100) ?? "New Chat",
            updatedMessages.map((msg) => ({
              role: msg.role,
              parts: msg.parts ?? [],
            })),
          );
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
