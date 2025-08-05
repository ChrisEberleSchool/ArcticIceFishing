import { io } from "socket.io-client";

// This makes the socket connection reusable across all scenes/modules
//const socket = io("https://arcticicefishing-1.onrender.com");
const socket = io("http://localhost:3000");

export default socket;
