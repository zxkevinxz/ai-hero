import type { UIMessage } from "ai";

export function isNewChatCreated(data: unknown): data is {
  type: "NEW_CHAT_CREATED";
  chatId: string;
} {
  return (
    typeof data === "object" &&
    data !== null &&
    "type" in data &&
    data.type === "NEW_CHAT_CREATED" &&
    "chatId" in data &&
    typeof data.chatId === "string"
  );
}

export const messageToString = (message: UIMessage) => {
  return message.parts
    .map((part) => {
      if (part.type === "text") {
        return part.text;
      }
      return "";
    })
    .join("");
};
