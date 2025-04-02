"use server";

import { revalidatePath } from "next/cache";
import { auth } from "~/server/auth";
import { deleteChatById } from "~/server/db/chat";

export async function deleteChatAction(chatId: string) {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }
  const result = await deleteChatById(chatId, session.user.id);
  revalidatePath("/");
  return result;
}
