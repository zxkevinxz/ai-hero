# Advanced MCP Server with Multiple Tools and Error Handling

This article builds on [our basic MCP server tutorial](./article.md) by creating a more robust implementation with multiple tools, error handling, and best practices.

## Prerequisites

Before starting, make sure you have:

- Node.js 18+ installed
- `npm` or `pnpm` package manager
- [Claude Code](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview) installed
- Basic understanding of TypeScript

## Project Setup

Let's create a proper project structure:

```bash
mkdir advanced-mcp-server
cd advanced-mcp-server
npm init -y
npm install @modelcontextprotocol/sdk zod
npm install --save-dev tsx @types/node typescript
```

Create a `tsconfig.json` file for TypeScript configuration:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "esModuleInterop": true,
    "strict": true,
    "outDir": "dist"
  },
  "include": ["src/**/*"]
}
```

Update your `package.json` to include helpful scripts:

```json
{
  "name": "advanced-mcp-server",
  "version": "1.0.0",
  "description": "Advanced MCP server with multiple tools",
  "type": "module",
  "scripts": {
    "start": "tsx src/main.ts",
    "dev": "tsx watch src/main.ts",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.x.x",
    "zod": "^3.x.x"
  },
  "devDependencies": {
    "@types/node": "^20.x.x",
    "tsx": "^4.x.x",
    "typescript": "^5.x.x"
  }
}
```

## Project Structure

Create a modular project structure:

```
src/
  ├── main.ts          # Main entry point
  ├── server.ts        # MCP server setup
  ├── tools/           # Tool implementations
  │   ├── index.ts     # Tool exports
  │   ├── weather.ts   # Weather tool
  │   ├── calculator.ts # Calculator tool
  │   └── search.ts    # Search tool
  └── utils/
      ├── logger.ts    # Logging utilities
      └── errors.ts    # Error handling
```

## Core Server Implementation

Let's start by implementing the main server module in `src/server.ts`:

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerTools } from "./tools/index.js";
import { logger } from "./utils/logger.js";

export async function createServer() {
  // Create the MCP server
  const server = new McpServer({
    name: "Advanced MCP Demo",
    version: "1.0.0",
    description:
      "An advanced MCP server with multiple tools and error handling",
  });

  // Register all tools
  registerTools(server);

  // Set up error handling
  process.on("uncaughtException", (error) => {
    logger.error("Uncaught exception:", error);
    // Don't exit the process, as it would terminate the MCP connection
  });

  process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled rejection:", reason);
  });

  // Create and connect transport
  const transport = new StdioServerTransport();

  try {
    logger.info("Connecting server to transport...");
    await server.connect(transport);
    logger.info("Server connected successfully!");
  } catch (error) {
    logger.error(
      "Failed to connect server to transport:",
      error,
    );
    throw error;
  }

  return server;
}
```

## Logging Utility

Create a simple logger in `src/utils/logger.ts`:

```typescript
// A basic logger that writes to files to avoid interfering with stdio transport
import { appendFileSync } from "fs";
import { join } from "path";

const LOG_FILE = join(process.cwd(), "mcp-server.log");

function formatMessage(
  level: string,
  message: string,
  data?: any,
): string {
  const timestamp = new Date().toISOString();
  const dataStr = data
    ? `\n${JSON.stringify(data, null, 2)}`
    : "";
  return `[${timestamp}] [${level}] ${message}${dataStr}\n`;
}

export const logger = {
  info(message: string, data?: any) {
    const logMessage = formatMessage(
      "INFO",
      message,
      data,
    );
    appendFileSync(LOG_FILE, logMessage);
  },

  error(message: string, error?: any) {
    const logMessage = formatMessage(
      "ERROR",
      message,
      error,
    );
    appendFileSync(LOG_FILE, logMessage);
  },

  debug(message: string, data?: any) {
    const logMessage = formatMessage(
      "DEBUG",
      message,
      data,
    );
    appendFileSync(LOG_FILE, logMessage);
  },
};
```

## Error Handling Utilities

Create error utilities in `src/utils/errors.ts`:

```typescript
export class ToolError extends Error {
  constructor(
    message: string,
    public readonly code: string = "TOOL_ERROR",
  ) {
    super(message);
    this.name = "ToolError";
  }
}

export class ValidationError extends ToolError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

export class ExternalServiceError extends ToolError {
  constructor(
    message: string,
    public readonly service: string,
  ) {
    super(
      `${service} service error: ${message}`,
      "EXTERNAL_SERVICE_ERROR",
    );
    this.name = "ExternalServiceError";
  }
}

export function createErrorResponse(error: Error) {
  return {
    content: [
      {
        type: "text",
        text: `Error: ${error.message}`,
      },
    ],
    isError: true,
  };
}
```

## Tool Implementations

Create a tool registry in `src/tools/index.ts`:

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerWeatherTool } from "./weather.js";
import { registerCalculatorTool } from "./calculator.js";
import { registerSearchTool } from "./search.js";
import { logger } from "../utils/logger.js";

export function registerTools(server: McpServer) {
  logger.info("Registering tools...");

  try {
    registerWeatherTool(server);
    registerCalculatorTool(server);
    registerSearchTool(server);

    logger.info("All tools registered successfully");
  } catch (error) {
    logger.error("Failed to register tools:", error);
    throw error;
  }
}
```

### Weather Tool with Error Handling

Implement the weather tool in `src/tools/weather.ts`:

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { logger } from "../utils/logger.js";
import {
  ExternalServiceError,
  createErrorResponse,
} from "../utils/errors.js";

// Simulated API function that could fail
async function fetchWeatherData(
  city: string,
): Promise<string> {
  logger.debug(`Fetching weather for ${city}`);

  // Simulate API delay
  await new Promise((resolve) =>
    setTimeout(resolve, 300),
  );

  // Simulate random errors for demonstration
  if (Math.random() < 0.1) {
    throw new ExternalServiceError(
      "API rate limit exceeded",
      "Weather",
    );
  }

  if (city.toLowerCase() === "error") {
    throw new ExternalServiceError(
      "City not found",
      "Weather",
    );
  }

  // Return mock weather data
  const conditions = [
    "sunny",
    "cloudy",
    "rainy",
    "snowy",
    "windy",
  ];
  const temp = Math.round(Math.random() * 30 + 10); // Random temp between 10-40°C
  const condition =
    conditions[
      Math.floor(Math.random() * conditions.length)
    ];

  return `${temp}°C and ${condition}`;
}

export function registerWeatherTool(
  server: McpServer,
) {
  server.tool(
    "getWeather",
    {
      city: z
        .string()
        .min(
          2,
          "City name must be at least 2 characters",
        ),
      units: z
        .enum(["celsius", "fahrenheit"])
        .optional()
        .default("celsius"),
    },
    async ({ city, units }) => {
      try {
        logger.info(
          `Weather tool called for city: ${city}, units: ${units}`,
        );

        const weatherData =
          await fetchWeatherData(city);

        // Convert if needed
        let displayWeather = weatherData;
        if (
          units === "fahrenheit" &&
          weatherData.includes("°C")
        ) {
          const celsiusMatch =
            weatherData.match(/(\d+)°C/);
          if (celsiusMatch) {
            const celsius = parseInt(
              celsiusMatch[1],
              10,
            );
            const fahrenheit = Math.round(
              (celsius * 9) / 5 + 32,
            );
            displayWeather = weatherData.replace(
              `${celsius}°C`,
              `${fahrenheit}°F`,
            );
          }
        }

        return {
          content: [
            {
              type: "text",
              text: `The weather in ${city} is ${displayWeather}.`,
            },
          ],
        };
      } catch (error) {
        logger.error(
          `Weather tool error for ${city}:`,
          error,
        );

        return createErrorResponse(
          error instanceof Error
            ? error
            : new Error(String(error)),
        );
      }
    },
  );

  logger.info("Weather tool registered");
}
```

### Calculator Tool

Implement a calculator tool in `src/tools/calculator.ts`:

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { logger } from "../utils/logger.js";
import {
  ValidationError,
  createErrorResponse,
} from "../utils/errors.js";

export function registerCalculatorTool(
  server: McpServer,
) {
  server.tool(
    "calculate",
    {
      operation: z.enum([
        "add",
        "subtract",
        "multiply",
        "divide",
      ]),
      a: z.number(),
      b: z.number(),
    },
    async ({ operation, a, b }) => {
      try {
        logger.info(
          `Calculator tool called: ${operation}(${a}, ${b})`,
        );

        let result: number;

        switch (operation) {
          case "add":
            result = a + b;
            break;
          case "subtract":
            result = a - b;
            break;
          case "multiply":
            result = a * b;
            break;
          case "divide":
            if (b === 0) {
              throw new ValidationError(
                "Cannot divide by zero",
              );
            }
            result = a / b;
            break;
        }

        return {
          content: [
            {
              type: "text",
              text: `Result of ${operation}(${a}, ${b}) = ${result}`,
            },
          ],
        };
      } catch (error) {
        logger.error(`Calculator tool error:`, error);
        return createErrorResponse(
          error instanceof Error
            ? error
            : new Error(String(error)),
        );
      }
    },
  );

  logger.info("Calculator tool registered");
}
```

### Search Tool

Implement a simple search tool in `src/tools/search.ts`:

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { logger } from "../utils/logger.js";
import {
  ExternalServiceError,
  createErrorResponse,
} from "../utils/errors.js";

// Mock database of items
const mockDatabase = [
  {
    id: 1,
    name: "TypeScript Handbook",
    category: "programming",
  },
  {
    id: 2,
    name: "JavaScript: The Good Parts",
    category: "programming",
  },
  {
    id: 3,
    name: "The Lord of the Rings",
    category: "fiction",
  },
  { id: 4, name: "Dune", category: "fiction" },
  {
    id: 5,
    name: "Clean Code",
    category: "programming",
  },
  {
    id: 6,
    name: "Design Patterns",
    category: "programming",
  },
  { id: 7, name: "1984", category: "fiction" },
  {
    id: 8,
    name: "To Kill a Mockingbird",
    category: "fiction",
  },
];

async function performSearch(
  query: string,
  category?: string,
) {
  // Simulate API delay
  await new Promise((resolve) =>
    setTimeout(resolve, 200),
  );

  // Simulate failure
  if (query.toLowerCase().includes("fail")) {
    throw new ExternalServiceError(
      "Search engine temporarily unavailable",
      "Search",
    );
  }

  // Perform mock search
  const normalizedQuery = query.toLowerCase();
  let results = mockDatabase.filter((item) =>
    item.name.toLowerCase().includes(normalizedQuery),
  );

  // Filter by category if provided
  if (category) {
    results = results.filter(
      (item) => item.category === category,
    );
  }

  return results;
}

export function registerSearchTool(server: McpServer) {
  server.tool(
    "search",
    {
      query: z
        .string()
        .min(1, "Search query cannot be empty"),
      category: z.string().optional(),
    },
    async ({ query, category }) => {
      try {
        logger.info(
          `Search tool called: query="${query}", category=${category || "any"}`,
        );

        const results = await performSearch(
          query,
          category,
        );

        if (results.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: `No results found for "${query}"${category ? ` in category "${category}"` : ""}.`,
              },
            ],
          };
        }

        const resultText = results
          .map(
            (item) =>
              `- ${item.name} (${item.category})`,
          )
          .join("\n");

        return {
          content: [
            {
              type: "text",
              text: `Found ${results.length} results for "${query}":\n\n${resultText}`,
            },
          ],
        };
      } catch (error) {
        logger.error(`Search tool error:`, error);
        return createErrorResponse(
          error instanceof Error
            ? error
            : new Error(String(error)),
        );
      }
    },
  );

  logger.info("Search tool registered");
}
```

## Main Entry Point

Finally, implement the main entry point in `src/main.ts`:

```typescript
import { createServer } from "./server.js";
import { logger } from "./utils/logger.js";

async function main() {
  try {
    logger.info("Starting Advanced MCP Server...");
    const server = await createServer();
    logger.info("Server started successfully");

    // Keep the process alive
    process.stdin.resume();

    // Handle shutdown gracefully
    const shutdown = async () => {
      logger.info("Shutting down...");
      process.exit(0);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Unhandled error in main:", error);
  process.exit(1);
});
```

## Connecting to Claude Code

Now we have a more advanced MCP server with multiple tools and robust error handling. Connect it to Claude Code using:

```bash
claude mcp add "advanced-mcp" npx tsx "/path-to-your-project/src/main.ts"
```

Once connected, you can use any of the three tools:

1. **Weather tool**: Get weather for a city
2. **Calculator tool**: Perform mathematical operations
3. **Search tool**: Search a mock database

## Testing Your Server

Before connecting to Claude, you can test your server locally. Create a basic test script called `test-tool.js`:

```javascript
const { spawn } = require("child_process");
const path = require("path");

// Spawn the MCP server
const serverProcess = spawn("npx", [
  "tsx",
  path.join(__dirname, "src/main.ts"),
]);

// Prepare a sample tool call message
const toolCallMessage = {
  type: "request",
  id: "test-1",
  request: {
    type: "call_tool",
    params: {
      name: "getWeather",
      arguments: {
        city: "London",
        units: "celsius",
      },
    },
  },
};

// Send the message to the server
serverProcess.stdin.write(
  JSON.stringify(toolCallMessage) + "\n",
);

// Handle server output
serverProcess.stdout.on("data", (data) => {
  try {
    // Parse each line (there might be multiple messages)
    const lines = data.toString().trim().split("\n");

    for (const line of lines) {
      if (!line.trim()) continue;

      const response = JSON.parse(line);
      console.log("Received response:");
      console.log(JSON.stringify(response, null, 2));

      // Exit after getting the response
      serverProcess.kill();
    }
  } catch (error) {
    console.error("Error parsing response:", error);
  }
});

// Handle errors
serverProcess.stderr.on("data", (data) => {
  console.error(`Server error: ${data}`);
});

serverProcess.on("close", (code) => {
  console.log(
    `Server process exited with code ${code}`,
  );
});
```

Run this test script with `node test-tool.js` to verify your server is working correctly.

## Best Practices for Advanced MCP Servers

1. **Structure your code**: Separate tools, utilities, and server setup for better maintainability.

2. **Implement robust error handling**: Catch and log errors, and return meaningful error responses.

3. **Add proper validation**: Use Zod schemas to validate and type input parameters.

4. **Add logging**: Log important events and errors to help with debugging.

5. **Use TypeScript**: Leverage TypeScript for better code quality and developer experience.

6. **Graceful shutdown**: Handle shutdown signals properly to ensure clean exit.

7. **Test before connecting**: Verify your server works correctly before connecting to Claude Code.

## Conclusion

This advanced MCP server implementation demonstrates several important concepts beyond the basics:

1. Modular project structure for maintainability
2. Multiple tools with different functionalities
3. Comprehensive error handling and validation
4. Logging for debugging
5. TypeScript for type safety

With these patterns in place, you can build complex MCP servers that provide Claude Code with powerful custom functionality while maintaining reliability and robustness.

As MCP adoption grows across different AI applications, these practices will help you create professional-grade integration tools that can be maintained and extended over time.
