## Problem

Our frontend is not as nice as it could be. Specifically, one feature I really like in other question answerers is that they show their reasoning visually.

Specifically, they show each step taken, and why it's been taken. We're going to implement something similar.

To do this, we're going to wring a bit more juice out of our `getNextAction` function. As well as the next action, we're going to get it to emit the reason why it's taking that action, as well as a `title` for the step it's taking.

This means our action schema will need to change slightly:

```typescript
import { z } from "zod";

export const actionSchema = z.object({
  reasoning: z
    .string()
    .describe("The reason for taking this action"),
  title: z
    .string()
    .describe(
      "A concise, descriptive title for the step, like 'Searching for Bukayo Saka's Injury Record' or 'Scraping News Articles'",
    ),
  type, // existing 'type' field
  query, // existing 'query' field
  urls, // existing 'urls' field
});
```

We could use the `dataStream.writeData` function here, but there's a better way. In the AI SDK, you can annotate messages directly with the `dataStream.writeMessageAnnotation` function.

```typescript
dataStream.writeMessageAnnotation({
  type: "step",
  data: { reasoning, title },
});
```

This will add a new annotation to the currently streaming message. It will be saved under the `annotations` property of that message.

Finally, we'll use the `data` from `useChat` to display these steps in the UI.

## Steps To Complete

- Read the existing `getNextAction` function.
- Update the `getNextAction` function to return the new `reasoning` and `title` fields.
- When `getNextAction` completes, use `dataStream.writeData` to send the data to the frontend.
- Update the frontend to display a history of all the steps taken in the UI. It should display as a list to the left of the message body. Once the message body starts streaming in, it should be displayed on the right of the steps.
