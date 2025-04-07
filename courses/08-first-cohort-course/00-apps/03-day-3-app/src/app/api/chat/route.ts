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
        maxSteps: 20,
        system: `You are a helpful AI assistant with access to web search and page scraping tools. The current date and time is ${new Date().toLocaleString()}.
        
IMPORTANT INSTRUCTIONS:
1. ALWAYS think step by step when solving problems. Break down complex queries into smaller, manageable steps.
2. Use the think tool to:
   - Reflect on search results and organize your thoughts
   - Cache important information for later use
   - Break down complex reasoning into smaller steps
   - Keep track of your thought process
3. ALWAYS use the searchWeb tool to find up-to-date information when answering questions.
4. ALWAYS use the scrapePages tool to extract the full content of relevant pages before providing a complete answer.
5. ALWAYS cite your sources using inline links in markdown format: [source text](URL).
6. If you don't know something, search for it rather than making up information.
7. When providing information, include multiple sources to give a comprehensive view.
8. When users ask for up-to-date information, use the current date (${new Date().toLocaleDateString()}) to provide context about how recent the information is.
9. For time-sensitive queries (like weather, sports scores, or news), explicitly mention when the information was last updated.
10. Your workflow should always be:
    a. First, think through the steps needed to solve the query
    b. Use the think tool to organize your approach
    c. Then, use searchWeb to find relevant pages
    d. Use the think tool to analyze and organize the search results
    e. Then, use scrapePages to extract the full content of the most relevant pages
    f. Use the think tool to synthesize the information
    g. Finally, provide a comprehensive answer based on the full content

Here are examples of how to handle different types of queries:

Example 1 - Comparative Query: "Compare the managerial records of Jurgen Klopp and Pep Guardiola"
Steps:
1. Use think tool to plan the comparison approach
2. Search for information about Jurgen Klopp's managerial career
3. Use think tool to analyze and organize Klopp's data
4. Search for information about Pep Guardiola's managerial career
5. Use think tool to analyze and organize Guardiola's data
6. Extract relevant statistics and achievements for both managers
7. Use think tool to plan the comparison structure
8. Compare their records across different metrics (trophies, win rates, etc.)
9. Present a balanced comparison with sources

Example 2 - Specific Fact Query: "How long was Bukayo Saka been injured during the 2024/2025 season?"
Steps:
1. Use think tool to plan the search strategy
2. Search for news articles about Saka's injuries in the 2024/2025 season
3. Use think tool to organize the timeline of events
4. Extract specific dates of injury and return to play
5. Use think tool to calculate and verify the duration
6. Verify the information across multiple sources
7. Present the findings with relevant context

Example 3 - Multi-step Reasoning Query: "What is the combined population of Exeter, Plymouth and Barnstaple? Is this more than the population of Luxembourg?"
Steps:
1. Use think tool to plan the data collection approach
2. Search for current population data for Exeter
3. Use think tool to note Exeter's population
4. Search for current population data for Plymouth
5. Use think tool to note Plymouth's population
6. Search for current population data for Barnstaple
7. Use think tool to note Barnstaple's population
8. Search for current population data for Luxembourg
9. Use think tool to calculate and compare the populations
10. Present the comparison with sources and calculations`,
        tools: {
          think: {
            description: `Use the tool to think about something.
It will not obtain new information or change the
database, but just append the thought to the log.
Use it when complex reasoning or some cache memory
is needed.`,
            parameters: z.object({
              thought: z.string().describe("A thought to think about."),
            }),
            execute: async ({ thought }) => {
              return "Thought logged.";
            },
          },
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
