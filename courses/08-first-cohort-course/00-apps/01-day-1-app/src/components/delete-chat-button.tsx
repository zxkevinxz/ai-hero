"use client";

import { TrashIcon } from "lucide-react";

export function DeleteChatButton() {
  return (
    <button
      className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800 text-gray-400 hover:bg-red-900 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-400"
      title="Delete chat"
    >
      <TrashIcon className="h-4 w-4" />
    </button>
  );
}
