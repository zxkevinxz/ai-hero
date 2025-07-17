import { generateText } from "ai";
import { summarizationModel } from "./model.ts";
import { cacheWithRedis } from "./server/redis/redis.ts";

type SummarizeURLArgs = {
  conversation: string;
  scrapedContent: string;
  searchMetadata: {
    date: string;
    title: string;
    url: string;
  };
  query: string;
  langfuseTraceId?: string;
  ctx?: import("./system-context").SystemContext;
};

export const summarizeURL = cacheWithRedis(
  "summarizeURL",
  async (opts: SummarizeURLArgs): Promise<string> => {
    const {
      conversation,
      scrapedContent,
      searchMetadata,
      query,
      langfuseTraceId,
    } = opts;

    const prompt = `You are a research extraction specialist. Given a research topic and raw web content, create a thoroughly detailed synthesis as a cohesive narrative that flows naturally between key concepts.

Research Topic: ${query}

Source Title: ${searchMetadata.title}
Source URL: ${searchMetadata.url}
Source Date: ${searchMetadata.date}

Conversation History (for context):
${conversation}

Raw Web Content:
<content>
${scrapedContent}
</content>

Extract the most valuable information related to the research topic, including relevant facts, statistics, methodologies, claims, and contextual information. Preserve technical terminology and domain-specific language from the source material.

Structure your synthesis as a coherent document with natural transitions between ideas. Begin with an introduction that captures the core thesis and purpose of the source material. Develop the narrative by weaving together key findings and their supporting details, ensuring each concept flows logically to the next.

Integrate specific metrics, dates, and quantitative information within their proper context. Explore how concepts interconnect within the source material, highlighting meaningful relationships between ideas. Acknowledge limitations by noting where information related to aspects of the research topic may be missing or incomplete.

Important guidelines:
- Maintain original data context (e.g., "2024 study of 150 patients" rather than generic "recent study")
- Preserve the integrity of information by keeping details anchored to their original context
- Create a cohesive narrative rather than disconnected bullet points or lists
- Use paragraph breaks only when transitioning between major themes

Critical Reminder: If content lacks a specific aspect of the research topic, clearly state that in the synthesis, and you should NEVER make up information and NEVER rely on external knowledge.
`;

    const { text, usage } = await generateText({
      model: summarizationModel,
      prompt: prompt,
      experimental_telemetry: langfuseTraceId
        ? {
            isEnabled: true,
            functionId: "summarize-url",
            metadata: {
              langfuseTraceId,
              url: searchMetadata.url,
              query,
            },
          }
        : undefined,
    });

    if (opts.ctx && usage) {
      opts.ctx.reportUsage("summarize-url", usage);
    }

    return text;
  },
);
