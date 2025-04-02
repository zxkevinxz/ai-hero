### Supporting Information:

<AISummary title="`data` in the `useChat` hook" href="https://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-chat#data">

The `useChat` hook returns an object with a `data` property. The `data` property is an array - each element of which can be written to using the `dataStream.writeData` method.

It can be accessed like so:

```ts
const { data } = useChat();
```

`data` may be undefined, so check for that first.

`data` is an array of objects. The latest item sent from the data stream is the last item in the array.

</AISummary>

### Steps to complete:

- In `/api/chat`, if there is no `chatId`, write some data to the `dataStream` to indicate that a new chat has been created.

```ts
if (!chatId) {
  dataStream.writeData({
    type: "NEW_CHAT_CREATED",
    chatId: currentChatId,
  });
}
```

- Make a `isNewChatCreated` util to check if something is an object with a `type` property equal to `"NEW_CHAT_CREATED"`, and a `chatId` property:

```ts
export function isNewChatCreated(
  data: unknown,
): data is {
  type: "NEW_CHAT_CREATED";
  chatId: string;
} {
  return (
    typeof data === "object" &&
    data !== null &&
    "type" in data &&
    data.type === "NEW_CHAT_CREATED"
  );
}
```

- Grab `data` from the result of the `useChat` hook. If the latest `data` item is a `NEW_CHAT_CREATED` object, redirect to `?id=${data.chatId}` by using `useRouter` from `next/navigation`. Do NOT use `messages` to get the chatId.

- The `chatId` needed for `api/chat` comes from the search params: `?id=...`. But search params can't be accessed from a `use client` component - so you need to grab them from the parent `page.tsx` component and pass them as a prop to the chat page component. Retain the existing props for `ChatPage`, and don't change the way it's declared or exported.

- The search params also need to be accessed as a promise:

```ts
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
}
```

- Pass the `chatId` via the `body` property in `useChat`. That will send it as part of the request body to `api/chat`.

```ts
useChat({
  body: {
    chatId,
  },
});
```
