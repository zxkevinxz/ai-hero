import type { LanguageModelV1 } from "ai";

/**
 * Since the timestamps are stored as strings in the cache,
 * this function is used to hydrate them back to Date objects.
 */
export const fixTimestampsOnCachedObject = (
  obj: any
): Awaited<ReturnType<LanguageModelV1["doGenerate"]>> => {
  if (obj?.response?.timestamp) {
    obj.response.timestamp = new Date(obj.response.timestamp);
  }
  return obj as any;
};
