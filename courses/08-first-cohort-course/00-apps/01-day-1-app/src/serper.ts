import { z } from "zod";

const serperResponseSchema = z.object({
  organic: z.array(
    z.object({
      title: z.string(),
      link: z.string(),
      snippet: z.string(),
    }),
  ),
});

type SerperResponse = z.infer<typeof serperResponseSchema>;

type SerperParams = {
  q: string;
  num?: number;
};

export async function searchSerper(
  params: SerperParams,
  signal?: AbortSignal,
): Promise<SerperResponse> {
  const response = await fetch(
    `https://google.serper.dev/search?${new URLSearchParams({
      q: params.q,
      num: params.num?.toString() ?? "10",
    })}`,
    {
      headers: {
        "X-API-KEY": process.env.SERPER_API_KEY!,
      },
      signal,
    },
  );

  if (!response.ok) {
    throw new Error(`Serper API error: ${response.statusText}`);
  }

  const data = await response.json();
  return serperResponseSchema.parse(data);
}
