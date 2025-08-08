import bcrypt from "bcrypt";
import prisma from "../db/prismaClient.js";
import { users } from "../state/users.js"; // Still used to map socketId in memory

// Toggle this to enable/disable password hashing
const USE_ENCRYPTION = false;

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

      let storedPassword;
      if (USE_ENCRYPTION) {
        storedPassword = await bcrypt.hash(password, 10);
      } else {
        storedPassword = password; // plaintext
      }

      const newUser = await prisma.user.create({
        data: {
          username,
          password: storedPassword,
        },
      });

      users[username] = {
        password: storedPassword,
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

    // 1. Check if user already logged in on another socket
    if (users[username] && users[username].socketId !== socket.id) {
      return socket.emit("authError", "User already logged in");
    }

    try {
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user) {
        return socket.emit("authError", "User not found");
      }

      let valid;
      if (USE_ENCRYPTION) {
        valid = await bcrypt.compare(password, user.password);
      } else {
        valid = password === user.password;
      }

      if (!valid) {
        return socket.emit("authError", "Incorrect password");
      }

      users[username] = {
        password: user.password,
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
