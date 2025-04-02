import { EventEmitter } from "node:stream";
import type { DataStreamString } from "./types";
import { once } from "node:events";

type TextChunk =
  | {
      type: "reasoning";
      content: string;
    }
  | {
      type: "text";
      content: string;
    };

const textChunkTypeToDataStreamProtocolMap = {
  text: "0",
  reasoning: "g",
} as const;

const ZERO_LENGTH_CHARACTER = "\u200B";

/**
 * Processes text by prefixing spaces and newlines with a zero-length character and then splits by that character
 * @param text The input text to process
 * @param type The type of text chunk (text or reasoning)
 * @returns Array of TextChunk objects
 */
const processTextWithZeroLengthChar = (
  text: string,
  type: "text" | "reasoning",
): TextChunk[] => {
  // Prefix spaces and newlines with zero-length character
  const processedText = text.replace(/(\s|\n)/g, `${ZERO_LENGTH_CHARACTER}$1`);

  // Split by the zero-length character
  const parts = processedText.split(ZERO_LENGTH_CHARACTER);

  // Convert to TextChunk objects
  return parts.map((part) => ({
    type,
    content: part,
  }));
};

const EMPTY_EVENT = "empty";

export const createDataStreamWritable = (opts: { chunkDelay: number }) => {
  const chunks: TextChunk[] = [];
  const emitter = new EventEmitter<{
    empty: [];
  }>();

  let controller: ReadableStreamDefaultController<DataStreamString> = null!;

  const readableStream = new ReadableStream<DataStreamString>({
    start(c) {
      controller = c;
    },
  });

  const interval = setInterval(() => {
    const currentChunk = chunks[0];
    if (typeof currentChunk === "undefined") {
      emitter.emit(EMPTY_EVENT);
      return;
    }

    const textChunk = currentChunk.content
      .replaceAll('"', '\\"')
      .replaceAll("\n", "\\n");
    const prefix = textChunkTypeToDataStreamProtocolMap[currentChunk.type];

    controller.enqueue(`${prefix}:"${textChunk}"\n`);

    chunks.splice(0, 1);
  }, opts.chunkDelay);

  const stop = () => {
    controller.close();
    clearInterval(interval);
  };

  return {
    addChunk: (text: string, type: "text" | "reasoning" = "text") => {
      // Process the text and add the chunks
      const newChunks = processTextWithZeroLengthChar(text, type);
      chunks.push(...newChunks);
    },
    readableStream,
    stop,
    [Symbol.dispose]: () => {
      stop();
    },
    waitForClose: async () => {
      await once(emitter, EMPTY_EVENT);
      stop();
    },
  };
};
