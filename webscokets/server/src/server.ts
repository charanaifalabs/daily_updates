import http from "http";
import app from "./app";
import { initChatSocket } from "./websocket/chatSocket";

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

initChatSocket(server);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
