import { io } from "socket.io-client";

const SERVER_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://arcticicefishing.onrender.com";

export function connectSocket(username) {
  return io(SERVER_URL, {
    query: { username },
    transports: ["websocket"],
  });
}
