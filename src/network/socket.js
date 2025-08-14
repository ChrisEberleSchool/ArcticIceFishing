import { io } from "socket.io-client";

const socket = io(
  process.env.NODE_ENV === "production"
    ? "https://arcticicefishing.onrender.com"
    : window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://arcticicefishing.onrender.com"
);

export default socket;
