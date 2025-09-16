import { useState } from "react";

export default function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
}) {
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-b-xl">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Type a message..."
        className="flex-1 px-4 py-2 border border-gray-300 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
      />
      <button
        onClick={submit}
        disabled={disabled}
        className="inline-flex items-center justify-center px-5 py-2 bg-emerald-600 text-white font-medium rounded-full shadow hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Send
      </button>
    </div>
  );
}
