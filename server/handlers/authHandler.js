import bcrypt from "bcrypt";
import prisma from "../db/prismaClient.js";
import { users } from "../state/users.js"; // Still used to map socketId in memory

export default function authHandler(socket, io) {
  // SIGNUP
  socket.on("signup", async ({ username, password }) => {
    if (!username || !password) {
      return socket.emit("authError", "Missing fields");
    }

    try {
      // Check if user already exists in DB
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });
      if (existingUser) {
        return socket.emit("authError", "Username already exists");
      }

      // Hash password & create user
      const hash = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: {
          username,
          password: hash,
          // x, y, coins, fishCaught will use default values
        },
      });

      // Track active user in memory (for sockets)
      users[username] = {
        password: hash,
        socketId: socket.id,
      };

      socket.emit("authSuccess", { username });
      console.log("Player Joined World:", username);
    } catch (err) {
      console.error("Signup Error:", err);
      socket.emit("authError", "Something went wrong.");
    }
  });

  // LOGIN
  socket.on("login", async ({ username, password }) => {
    if (!username || !password) {
      return socket.emit("authError", "Missing fields");
    }

    try {
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user) {
        return socket.emit("authError", "User not found");
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return socket.emit("authError", "Incorrect password");
      }

      // Track active user in memory
      users[username] = {
        password: user.password, // hashed
        socketId: socket.id,
      };

      socket.emit("authSuccess", { username });
      console.log("Player Logged In:", username);
    } catch (err) {
      console.error("Login Error:", err);
      socket.emit("authError", "Something went wrong.");
    }
  });
}
