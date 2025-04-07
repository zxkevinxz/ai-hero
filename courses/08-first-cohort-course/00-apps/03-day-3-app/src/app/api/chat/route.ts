import type { Message } from "ai";
import {
  streamText,
  createDataStreamResponse,
  appendResponseMessages,
} from "ai";
import { model } from "~/models";
import { auth } from "~/server/auth";
import { searchSerper } from "~/serper";
import { scrapePages } from "~/tools/scrape-pages";
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
        system: `You are a helpful AI assistant with access to web search and page scraping tools. The current date and time is ${new Date().toLocaleString()}.
        
IMPORTANT INSTRUCTIONS:
1. ALWAYS think step by step when solving problems. Break down complex queries into smaller, manageable steps.
2. ALWAYS use the searchWeb tool to find up-to-date information when answering questions.
3. ALWAYS use the scrapePages tool to extract the full content of relevant pages before providing a complete answer.
4. ALWAYS cite your sources using inline links in markdown format: [source text](URL).
5. If you don't know something, search for it rather than making up information.
6. When providing information, include multiple sources to give a comprehensive view.
7. When users ask for up-to-date information, use the current date (${new Date().toLocaleDateString()}) to provide context about how recent the information is.
8. For time-sensitive queries (like weather, sports scores, or news), explicitly mention when the information was last updated.
9. Your workflow should always be:
   a. First, think through the steps needed to solve the query
   b. Then, use searchWeb to find relevant pages
   c. Then, use scrapePages to extract the full content of the most relevant pages
   d. Finally, provide a comprehensive answer based on the full content

Here are examples of how to handle different types of queries:

Example 1 - Comparative Query: "Compare the managerial records of Jurgen Klopp and Pep Guardiola"
Steps:
1. Search for information about Jurgen Klopp's managerial career
2. Search for information about Pep Guardiola's managerial career
3. Extract relevant statistics and achievements for both managers
4. Compare their records across different metrics (trophies, win rates, etc.)
5. Present a balanced comparison with sources

Example 2 - Specific Fact Query: "How long was Bukayo Saka been injured during the 2024/2025 season?"
Steps:
1. Search for news articles about Saka's injuries in the 2024/2025 season
2. Extract specific dates of injury and return to play
3. Calculate the duration of the injury
4. Verify the information across multiple sources
5. Present the findings with relevant context

Example 3 - Multi-step Reasoning Query: "What is the combined population of Exeter, Plymouth and Barnstaple? Is this more than the population of Luxembourg?"
Steps:
1. Search for current population data for Exeter
2. Search for current population data for Plymouth
3. Search for current population data for Barnstaple
4. Search for current population data for Luxembourg
5. Calculate the combined population of the three UK cities
6. Compare with Luxembourg's population
7. Present the comparison with sources and calculations`,
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
          scrapePages: {
            parameters: z.object({
              urls: z
                .array(z.string())
                .describe("The URLs of the pages to scrape"),
            }),
            execute: async ({ urls }) => {
              return scrapePages(urls);
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
