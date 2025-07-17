import type { Message } from "ai";
import { streamText, createDataStreamResponse } from "ai";
import { auth } from "~/server/auth";
import { model } from "~/server/ai/model";
import { db } from "~/server/db";
import { requestLogs, users } from "~/server/db/schema";
import { and, eq, gte, sql } from "drizzle-orm";

export const maxDuration = 60;

// Rate limit: 10 requests per day for regular users
const DAILY_REQUEST_LIMIT = 10;

async function checkRateLimit(
  userId: string,
): Promise<{ allowed: boolean; isAdmin: boolean; requestCount: number }> {
  // Get user info to check if they're an admin
  const user = await db
    .select({ isAdmin: users.isAdmin })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user[0]) {
    throw new Error("User not found");
  }

  const isAdmin = user[0].isAdmin;

  // If user is admin, bypass rate limit
  if (isAdmin) {
    return { allowed: true, isAdmin: true, requestCount: 0 };
  }

  // Check today's requests for non-admin users
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today

  const requestCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(requestLogs)
    .where(
      and(eq(requestLogs.userId, userId), gte(requestLogs.requestedAt, today)),
    );

  const todayRequestCount = requestCount[0]?.count || 0;
  const allowed = todayRequestCount < DAILY_REQUEST_LIMIT;

  return { allowed, isAdmin: false, requestCount: todayRequestCount };
}

async function logRequest(userId: string, endpoint: string): Promise<void> {
  await db.insert(requestLogs).values({
    userId,
    endpoint,
  });
}

export async function POST(request: Request) {
  // Check if user is authenticated
  const session = await auth();

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;

  try {
    // Check rate limit
    const { allowed, isAdmin, requestCount } = await checkRateLimit(userId);

    if (!allowed) {
      const resetTime = new Date();
      resetTime.setDate(resetTime.getDate() + 1);
      resetTime.setHours(0, 0, 0, 0);

      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded",
          message: `You have reached your daily limit of ${DAILY_REQUEST_LIMIT} requests. Your limit will reset tomorrow at midnight.`,
          details: {
            requestCount,
            limit: DAILY_REQUEST_LIMIT,
            remaining: 0,
            resetTime: resetTime.toISOString(),
          },
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": DAILY_REQUEST_LIMIT.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": resetTime.toISOString(),
            "Retry-After": Math.ceil(
              (resetTime.getTime() - Date.now()) / 1000,
            ).toString(),
          },
        },
      );
    }

    // Log the request (for both admin and regular users)
    await logRequest(userId, "/api/chat");

    const body = (await request.json()) as {
      messages: Array<Message>;
    };

    return createDataStreamResponse({
      execute: async (dataStream) => {
        const { messages } = body;

        const result = streamText({
          model,
          messages,
          system: `You are a helpful AI assistant that can search the web to provide accurate and up-to-date information. When providing answers, always cite your sources with inline links to help users verify the information.

You should:
- Provide accurate, well-researched responses
- Always cite sources with inline markdown links in the format [link text](URL)
- Format all URLs as clickable markdown links for better readability
- Be helpful and informative`,
        });

        result.mergeIntoDataStream(dataStream, {
          sendSources: true,
        });
      },
      onError: (e) => {
        console.error(e);
        return "Oops, an error occured!";
      },
    });
  } catch (error) {
    console.error("Rate limit check failed:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
