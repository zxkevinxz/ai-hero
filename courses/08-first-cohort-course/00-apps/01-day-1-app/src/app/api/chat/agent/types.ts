import type { DataStreamWriter } from "ai";

export type Tool = "search" | "visit" | "answer" | "reflect";

export type QuestionEvaluationMetric =
  | "definitive"
  | "freshness"
  | "plurality"
  | "attribution"
  | "completeness";

export type SearchResult = {
  query: string;
  url: string;
  snippet: string;
  date?: string;
};

export type PrevAnswer = {
  question: string;
  answer: string;
  references: Array<{ exactQuote: string; url: string }> | undefined;
};

export type BadAttempt = {
  question: string;
  answer: string;
  evaluation: string;
  recap: string;
  blame: string;
  improvement: string;
};

export type DataStreamString =
  Parameters<DataStreamWriter["merge"]>[0] extends ReadableStream<infer T>
    ? T
    : never;
