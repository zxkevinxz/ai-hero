The model context protocol doesn't just work over standard I/O. It can also work over HTTP.

The protocol uses something called server-sent events (SSE). This allows bidirectional communication between the server and the client.

```mermaid
flowchart
  Server <-- MCP Protocol --> SSE <-- MCP Protocol --> Client
```

This means that the server can be hosted on the cloud, and the client can communicate with it via an HTTP connection.

Let's look at how that works.

## Setting Up The Server

We'll start with a simple server that we had in a [previous example](https://www.aihero.dev/mcp-server-from-a-single-typescript-file). This is a server with a single tool that returns the weather in a city.

```ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const server = new McpServer({
  name: "Weather Service",
  version: "1.0.0",
});

server.tool(
  "getWeather",
  {
    city: z.string(),
  },
  async ({ city }) => {
    return {
      content: [
        {
          type: "text",
          text: `The weather in ${city} is sunny!`,
        },
      ],
    };
  },
);
```

## Setting Up The Transport

To get this example working we'll use `express`.

_NOTE: I attempted to get this working with [Hono](https://hono.dev/docs/), but the model context protocol sdk appears to only work with Express. Let's hope they fix that soon, since Hono is much better._

<Scrollycoding>

# !!steps

First we'll import express and initialise a new app.

```ts ! example.ts
import express from "express";

const app = express();
```

# !!steps

Then we'll create a route to handle the initial SSE connection request.

This route will be used to handle new connections to the server.

```ts ! example.ts
import express from "express";

const app = express();

app.get("/sse", async (req, res) => {
  // implementation
});
```

# !!steps

When we get a new connection, we'll create a new SSE transport from it and save it to a local variable.

This approach is pretty limited - it only allows for one connection at a time. We'll explore a better approach later.

We add `/messages` as the path for the transport - we'll implement that later.

```ts ! example.ts
import express from "express";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

const app = express();

let transport: SSEServerTransport | undefined =
  undefined;

app.get("/sse", async (req, res) => {
  transport = new SSEServerTransport("/messages", res);
});
```

# !!steps

We'll then connect the server to the transport.

```ts ! example.ts
import express from "express";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

const app = express();

let transport: SSEServerTransport | undefined =
  undefined;

app.get("/sse", async (req, res) => {
  transport = new SSEServerTransport("/messages", res);
  await server.connect(transport);
});
```

</Scrollycoding>

```ts ! example.ts
// Full route
app.post("/messages", async (req, res) => {
  if (!transport) {
    res.status(400);
    res.json({ error: "No transport" });
    return;
  }
  await transport.handlePostMessage(req, res);
});
```

## Handling Messages

Now, let's implement the `/messages` route.

<Scrollycoding>

# !!steps

First we'll create the route.

```ts ! example.ts
app.post("/messages", async (req, res) => {
  // implementation
});
```

# !!steps

Then we'll check if we have a transport. If we don't, we'll return an error.

```ts ! example.ts
app.post("/messages", async (req, res) => {
  if (!transport) {
    res.status(400);
    res.json({ error: "No transport" });
    return;
  }
});
```

# !!steps

Finally, we'll call the transport's `handlePostMessage` method. This will handle the message and send a response back to the client.

```ts ! example.ts
app.post("/messages", async (req, res) => {
  if (!transport) {
    res.status(400);
    res.json({ error: "No transport" });
    return;
  }
  await transport.handlePostMessage(req, res);
});
```

</Scrollycoding>

## Testing It Out
