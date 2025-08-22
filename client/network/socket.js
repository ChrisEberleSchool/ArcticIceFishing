import { io } from "socket.io-client";

const baseURL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : window.location.origin; // automatically uses https://yourdomain.com

const socket = io(baseURL, {
  transports: ["websocket"], // ensures secure websocket connection
});

export default socket;
