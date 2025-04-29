Let's introduce you to the repo step-by-step.

## Next.js

This is a Next.js application. Next.js is an open source full-stack framework that lets you build React applications.

Next.js is going to manage two very important things:

- What the UI looks like
- How our backend server works

We're going to need to make a nice looking UI for users to interact with. But we'll also need some backend server code to call the LLM with, save things in our database, and authenticate our users.

To see what it looks like on the frontend, you can run `pnpm run dev` in the folder `01-day-1-app`.

This will start a local server on `localhost:3000`.

## Tailwind CSS

We're using Tailwind CSS to style the application. It's a popular CSS framework that LLMs are particularly good at using.

It works by providing a set of utility classes, like `mb-2` and `text-sm`, that you can use to style your HTML.

For instance, this is a label for the user's name in the chat message component:

```tsx
<p className="mb-2 text-sm font-semibold text-gray-400">
  {isAI ? "AI" : userName}
</p>
```

It has a margin bottom of 2 (mb-2), a text size of small (text-sm), and a font weight of semibold (font-semibold).

## Postgres & Drizzle

We're using Postgres as our database. Postgres is a popular open source database.

And we're using Drizzle to connect to Postgres.
