import { env } from "~/env";
import Redis from "ioredis";

export const redis = new Redis(env.REDIS_URL);

const CACHE_EXPIRY_SECONDS = 60 * 5; // 5 minutes
const CACHE_KEY_SEPARATOR = ":";

/**
 * Cache a function with Redis
 *
 * Takes in a function, and returns a function that caches any
 * calls to the function with Redis.
 *
 * @example
 * const add = (a: number, b: number) => {
 *   return a + b;
 * }
 *
 * const cachedAdd = cacheWithRedis("add", add);
 * const result = await cachedAdd(1, 2);
 *
 * // result is cached for 5 minutes
 * const result2 = await cachedAdd(1, 2);
 * // result2 is fetched from cache
 */
export const cacheWithRedis = <TFunc extends (...args: any[]) => Promise<any>>(
  keyPrefix: string,
  fn: TFunc,
): TFunc => {
  return (async (...args: Parameters<TFunc>) => {
    const key = `${keyPrefix}${CACHE_KEY_SEPARATOR}${JSON.stringify(args)}`;
    const cachedResult = await redis.get(key);
    if (cachedResult) {
      console.log(`Cache hit for ${key}`);
      return JSON.parse(cachedResult);
    }

    const result = await fn(...args);
    await redis.set(key, JSON.stringify(result), "EX", CACHE_EXPIRY_SECONDS);
    return result;
  }) as TFunc;
};
