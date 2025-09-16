import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function createSocket(username: string, token?: string) {
  if (socket) return socket;
  socket = io("http://localhost:5005", {
    auth: token ? { token } : undefined,
    query: { username },
    reconnectionAttempts: 5,
  });
  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
