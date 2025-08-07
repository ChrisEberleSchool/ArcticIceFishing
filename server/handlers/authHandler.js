import bcrypt from "bcrypt";
import { users } from "../state/users.js";

export default function authHandler(socket, io) {
  socket.on("signup", async ({ username, password }) => {
    if (!username || !password)
      return socket.emit("authError", "Missing fields");
    if (users[username]) return socket.emit("authError", "Username exists");

    const hash = await bcrypt.hash(password, 10);
    users[username] = { password: hash, socketId: socket.id };

    socket.emit("authSuccess", { username });
    console.log("Player Joined World:", username);
  });

  socket.on("login", async ({ username, password }) => {
    const user = users[username];
    if (!user) return socket.emit("authError", "User not found");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return socket.emit("authError", "Incorrect password");

    users[username].socketId = socket.id;
    socket.emit("authSuccess");
  });
}
