import { useEffect, useState, useRef } from "react";
import { getSocket } from "../services/socket";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";

interface Message {
  from: string;
  to: string;
  text: string;
}

export default function ChatContainer({
  username,
  selectedUser,
}: {
  username: string;
  selectedUser: string | null;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const msgHandler = (msg: Message) => {
      if (
        (msg.from === username && msg.to === selectedUser) ||
        (msg.from === selectedUser && msg.to === username)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("chat-message", msgHandler);

    return () => {
      socket.off("chat-message", msgHandler);
    };
  }, [username, selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!selectedUser) {
      alert("Select a user first!");
      return;
    }

    if (text.trim()) {
      const socket = getSocket();
      if (!socket) return;

      const msg: Message = { from: username, to: selectedUser, text };
      socket.emit("chat-message", msg);

      setMessages((prev) => [...prev, msg]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-md">
      <div className="h-14 flex items-center px-4 border-b bg-white rounded-t-xl">
        {selectedUser ? (
          <h3 className="text-gray-700 font-semibold">
            Chatting with{" "}
            <span className="text-emerald-600">{selectedUser}</span>
          </h3>
        ) : (
          <span className="text-gray-400">Select a user to start chatting</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3 bg-gray-50">
        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            from={msg.from}
            text={msg.text}
            currentUser={username}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t bg-white rounded-b-xl">
        <ChatInput onSend={sendMessage} />
      </div>
    </div>
  );
}
