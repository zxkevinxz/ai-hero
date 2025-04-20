## Problem

We've now built the structure of our loop, but we're not persisting the state of the system to the backend.

The way our UI is designed means that users can ask follow-up questions. If we don't persist the state of the system, we won't have the resources available to answer those follow-up questions.

This means we need to implement a couple of things at once:

- When the assistant is done, save the new message to the database.
- Now that we're using annotations, we need to save those to the database as well under a new `annotations` field.
- As new queries are searched and URLs are scraped, save them to the database as chat resources.

<!-- This is actually really hard decision. I think since I'm having to cut so much scope, I should do this as an optional extra. We definitely want to persist the annotations and the messages, but persisting the extra stuff feels like optional on top. -->

## Steps To Complete

- Read the existing Drizzle schemas file.
- Add a new `annotations` field to table where the messages are stored. It should be `json`, and optional.
- In the `/api/chat` route, once the answer has been given, save the message to the database.
- Add a new `chatScrapeResource` table for storing the URLs that have been scraped. It should have `url`, `title`, `scrapedResult` and `chatId` fields.
- When the `/api/chat` route is called, fetch all
