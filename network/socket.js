import { io } from "socket.io-client";

// This makes the socket connection reusable across all scenes/modules
const socket = io("https://arcticicefishing.onrender.com");
//onst socket = io("http://localhost:3000");
export default socket;
