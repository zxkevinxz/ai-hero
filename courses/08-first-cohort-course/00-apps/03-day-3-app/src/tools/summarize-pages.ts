import { generateText } from "ai";
import { summarizerModel } from "~/models";

export type PageContent = {
  title: string;
  link: string;
  snippet: string;
  content?: string;
};

export const summarizePages = async (
  pages: PageContent[],
  query: string,
): Promise<string> => {
  // Filter out pages without content
  const pagesWithContent = pages.filter((page) => page.content);

  if (pagesWithContent.length === 0) {
    return "No content found to summarize.";
  }

  // Concatenate all content with clear separators
  const concatenatedContent = pagesWithContent
    .map(
      (page) => `URL: ${page.link}
Title: ${page.title}
Content:
${page.content}
---`,
    )
    .join("\n\n");

  const result = await generateText({
    model: summarizerModel,
    system: `You are a helpful AI assistant tasked with summarizing web content. Your goal is to provide a clear, concise summary that answers the user's query while maintaining accuracy and relevance.

When summarizing:
1. Focus on information that directly relates to the user's query
2. Maintain factual accuracy - don't make assumptions
3. Include specific details and examples when relevant
4. Cite sources using markdown links [text](url)
5. Organize information logically
6. Highlight any conflicting information between sources
7. Keep the summary focused and to the point

The user's query is: "${query}"`,
    prompt: `Please summarize the following web content, focusing on information relevant to the query. Include citations to the source URLs:

${concatenatedContent}`,
  });

  return result.text;
};
