import { io } from "socket.io-client";

// This makes the socket connection reusable across all scenes/modules
const socket = io("https://arcticicefishing.onrender.com");

export function connectSocket(username) {
  return io({
    query: { username },
  });
}

export default socket;
