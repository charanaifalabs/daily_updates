import { Server } from "socket.io";

interface User {
  username: string;
  socketId: string;
}

let onlineUsers: User[] = [];

export const initChatSocket = (server: any) => {
  const io = new Server(server, {
    cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    socket.on("login", (username: string) => {
      onlineUsers = onlineUsers.filter((u) => u.username !== username);
      onlineUsers.push({ username, socketId: socket.id });
      io.emit(
        "users",
        onlineUsers.map((u) => u.username)
      );
    });
    socket.on(
      "chat-message",
      ({ from, to, text }: { from: string; to: string; text: string }) => {
        const recipient = onlineUsers.find((u) => u.username === to);

        if (recipient) {
          io.to(recipient.socketId).emit("chat-message", { from, to, text });
        }

        socket.emit("chat-message", { from, to, text });
      }
    );

    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter((u) => u.socketId !== socket.id);
      io.emit(
        "users",
        onlineUsers.map((u) => u.username)
      );
    });
  });
};
