"use client";

import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteChatAction } from "../actions";
import { toast } from "sonner";

export function DeleteChatButton({ chatId }: { chatId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    const result = await deleteChatAction(chatId);
    if (result.success) {
      router.refresh();
      if (window.location.search.includes(chatId)) {
        router.push("/");
      }
    } else {
      toast.error(`Failed to delete chat: ${result.error}`);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800 text-gray-400 hover:bg-red-900 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-400"
      title="Delete chat"
    >
      <TrashIcon className="h-4 w-4" />
    </button>
  );
}
