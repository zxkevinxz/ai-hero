import { Hono } from "hono";
import { cors } from "hono/cors";
import * as fs from "fs/promises";
import { join } from "path";
import { serve } from "@hono/node-server";
import { once } from "events";

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

const app = new Hono();
app.use(cors());

const DB_PATH = join(
  import.meta.dirname,
  "db.local.json",
);

// Database helper functions
const readDb = async (): Promise<
  Record<string, Post>
> => {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    await fs.writeFile(DB_PATH, JSON.stringify({}));
    return {};
  }
};

const writeDb = async (data: Record<string, Post>) => {
  await fs.writeFile(
    DB_PATH,
    JSON.stringify(data, null, 2),
  );
};

// Create a post
app.post("/posts", async (c) => {
  const db = await readDb();
  const body =
    await c.req.json<Omit<Post, "id" | "createdAt">>();
  const id = crypto.randomUUID();
  const post: Post = {
    id,
    title: body.title,
    content: body.content,
    createdAt: new Date().toISOString(),
  };

  db[id] = post;
  await writeDb(db);

  return c.json(post, 201);
});

// Get all posts
app.get("/posts", async (c) => {
  const db = await readDb();
  const posts = Object.values(db);
  return c.json(posts);
});

// Get single post
app.get("/posts/:id", async (c) => {
  const db = await readDb();
  const post = db[c.req.param("id")];
  if (!post)
    return c.json({ error: "Post not found" }, 404);
  return c.json(post);
});

// Update a post
app.put("/posts/:id", async (c) => {
  const db = await readDb();
  const id = c.req.param("id");
  if (!db[id])
    return c.json({ error: "Post not found" }, 404);

  const body =
    await c.req.json<
      Partial<
        Omit<Post, "id" | "createdAt" | "updatedAt">
      >
    >();
  db[id] = {
    ...db[id],
    ...body,
    updatedAt: new Date().toISOString(),
  };
  await writeDb(db);

  return c.json(db[id]);
});

// Delete a post
app.delete("/posts/:id", async (c) => {
  const db = await readDb();
  const id = c.req.param("id");
  if (!db[id])
    return c.json({ error: "Post not found" }, 404);

  delete db[id];
  await writeDb(db);

  return c.json({ success: true });
});

export const startServer = async () => {
  const server = serve({
    fetch: app.fetch,
    port: 4317,
    hostname: "0.0.0.0",
  });

  // Wait for the "listening" event to fire
  await once(server, "listening");

  return server;
};
