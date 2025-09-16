import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { createSocket, getSocket, disconnectSocket } from "../services/socket";
import API from "../services/api";

interface Message {
  from: string;
  text: string;
}

interface LocationState {
  username: string;
  token: string;
}

interface UserResponse {
  username: string;
}

export default function Chat() {
  const location = useLocation();
  const { username, token } = location.state as LocationState;

  const [users, setUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await API.get<UserResponse[]>("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allUsers = res.data.map((u) => u.username);
      setUsers(allUsers.filter((u) => u !== username));
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    const socket = createSocket(username, token);

    socket.on(
      "chat-message",
      (msg: { from: string; to: string; text: string }) => {
        if (msg.to === username || msg.from === username) {
          setMessages((prev) => [...prev, { from: msg.from, text: msg.text }]);
        }
      }
    );

    fetchUsers();

    return () => {
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!selectedUser) return alert("Select a user first");
    if (input.trim()) {
      const socket = getSocket();
      if (!socket) return;

      const msg = { from: username, to: selectedUser, text: input };
      socket.emit("chat-message", msg);
      setMessages((prev) => [...prev, { from: username, text: input }]);
      setInput("");
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-72 bg-white border-r shadow-sm flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-700">Online Users</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {users.length === 0 && (
            <p className="text-sm text-gray-400 text-center">No users online</p>
          )}
          {users.map((u) => (
            <div
              key={u}
              onClick={() => setSelectedUser(u)}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedUser === u
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {u}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="h-14 border-b bg-white flex items-center px-4">
          {selectedUser ? (
            <h3 className="font-semibold text-gray-700">
              Chatting with {selectedUser}
            </h3>
          ) : (
            <span className="text-gray-400">
              Select a user to start chatting
            </span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-gray-50">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.from === username ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-md shadow-sm ${
                  m.from === username
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <span className="block text-xs opacity-70 mb-1">{m.from}</span>
                <span>{m.text}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex items-center p-4 bg-white border-t">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-3 border rounded-l-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
            placeholder={
              selectedUser
                ? `Message to ${selectedUser}`
                : "Select a user to chat"
            }
          />
          <button
            onClick={sendMessage}
            className="bg-emerald-500 text-white px-6 py-3 rounded-r-xl hover:bg-emerald-600 transition-colors ml-4"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
