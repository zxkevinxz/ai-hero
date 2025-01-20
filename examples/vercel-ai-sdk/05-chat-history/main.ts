import { type CoreMessage } from "ai";
import { startServer } from "./server.ts";

const server = await startServer();

const messagesToSend: CoreMessage[] = [
  {
    role: "user",
    content: "What's the capital of Wales?",
  },
];

const newMessages = await fetch(
  `http://localhost:4317/api/get-completions`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messagesToSend),
  },
).then((res) => res.json() as Promise<CoreMessage[]>);

const allMessages = [
  ...messagesToSend,
  ...newMessages,
];

console.dir(allMessages, { depth: null });

server.close();
