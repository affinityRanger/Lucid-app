// src/components/ChatWidget.jsx

import { useState } from "react";
import { MessageSquare, X } from "lucide-react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div className="w-80 rounded-xl shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100">LUCID Chat</h2>
            <button onClick={() => setOpen(false)}>
              <X className="text-gray-500 hover:text-red-500" size={20} />
            </button>
          </div>
          <div className="p-4 text-sm text-gray-600 dark:text-gray-300">
            <p>This is a placeholder chat widget. Connect with the community here.</p>
          </div>
        </div>
      ) : (
        <button
          className="rounded-full bg-gradient-to-r from-green-600 to-green-400 p-3 text-white shadow-lg hover:scale-105 transition-transform"
          onClick={() => setOpen(true)}
          aria-label="Open chat"
        >
          <MessageSquare size={24} />
        </button>
      )}
    </div>
  );
}
