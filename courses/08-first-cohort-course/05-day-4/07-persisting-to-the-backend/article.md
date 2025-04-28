We've now built the structure of our loop, but we're not persisting the state of the system to the backend.

We can see this because when we refresh the page, the AI messages are lost.

<Video resourceId="persistingthesystem-SwMvJcLaU.mp4" />

## Adjusting our schema

The shape of our messages has slightly changed since we last worked on persistence. We're now storing annotations as well as parts.

- `annotations` are being used to show the reasoning steps in the UI
- `parts` contain the `text` content of the message

We need to adjust our schema to reflect this. We'll need to add a new `annotations` field to the `messages` table, and make it `json`.

## Fixing `onFinish`

We have an `onFinish` being passed to our loop, but it's never called. First things first, we should pass that to the function that answers the question.

```ts
streamText({
  onFinish: opts.onFinish, // from the parameters above
});
```

## Collecting the annotations

However we also need to make sure the annotations we're attaching to the message are collected.

We can do that in the scope of the `/api/chat` route, by saving the annotations in a temporary variable:

```ts
import type { OurMessageAnnotation } from "./types";

const annotations: OurMessageAnnotation[] = [];

// ...existing code

const writeMessageAnnotation = (
  annotation: OurMessageAnnotation,
) => {
  // Save the annotation in-memory
  annotations.push(annotation);
  // Send it to the client
  dataStream.writeMessageAnnotation(annotation);
};
```

Then, when the loop has finished, we can save the annotations to the database using the existing `upsertChat` function:

```ts
streamText({
  // ...existing code
  onFinish: async () => {
    await upsertChat({
      // ...existing code
      annotations, //
    });
  },
});
```

## Steps To Complete

- Read the existing Drizzle schemas file.
- Read the existing DB helper functions.
- Read the existing 'answer question' code.
- Add a new `annotations` field to table where the messages are stored. It should be `json`, and optional.
- Adjust the helper functions to save the annotations to the database, adjust the places the messages are fetched to include the annotations.
- Make sure the `onFinish` function is passed to the `streamText` function in the answer question code.
- Adjust the `onFinish` function to save the annotations to the database.
- Check it in the UI to see if it works.
