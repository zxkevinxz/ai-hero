We need to show something to the user while our system is working.

Currently all we have is a loading spinner. That's fine, but people expect a bit more from LLM-powered applications these days.

While we're walking through our loop, we should be showing the user what we're up to. We should be giving them some kind of insight as to the steps our system is taking.

This will serve two purposes:

- The latency will feel less painful because the user will have something to observe
- The user will trust the result more because they'll be able to see how our system got there.

## What do we want to show?

We've got a lot of different potential choices for what we show to the user. We can show:

- The steps our system is taking: 'answer', 'search' or 'visit'
- The sources that our system is reading via the 'visit' action
- The search results from the 'search' action

However, for the first draft we'll go simpler. We'll enlist the help of the LLM's we're calling. For instance, in the `getNextStep` action, we can ask for a short description of the step we're taking:

- Searching Saka's injury history...
- Comparing toaster ovens...
-

## Sending progress information

To do that, we're going to send information back to the user while our system is working.

We've already looked at one mechanism for sending live data back through our stream protocol - `dataStream.writeData`.

```ts
dataStream.writeData({
  type: "NEW_CHAT_CREATED",
  chatId: currentChatId,
});
```

We use this mechanism to communicate to the front end that a new chat had been created and pass it the chat ID.

We could use this same information to pass progress information back to the user.
