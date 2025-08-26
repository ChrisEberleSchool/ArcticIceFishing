import bcrypt from "bcrypt";
import prisma from "../db/prismaClient.js";
import { users } from "../state/users.js"; // Still used to map socketId in memory

// Toggle this to enable/disable password hashing
const USE_ENCRYPTION = false;

export default function authHandler(socket, io) {
  // SIGNUP
  socket.on("signup", async ({ username, password }, callback) => {
    if (!username || !password) {
      if (callback) callback({ success: false, message: "Missing fields" });
      return socket.emit("authError", "Missing fields");
    }

    try {
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUser) {
        if (callback)
          callback({ success: false, message: "Username already exists" });
        return socket.emit("authError", "Username already exists");
      }

      let storedPassword = USE_ENCRYPTION
        ? await bcrypt.hash(password, 10)
        : password;

      const newUser = await prisma.user.create({
        data: {
          username,
          password: storedPassword,
        },
      });

      users[username] = {
        id: newUser.id,
        socketId: socket.id,
      };

      socket.userId = newUser.id;
      socket.username = username;

      if (callback) callback({ success: true });

      socket.emit("authSuccess", { username });
      console.log("Player Joined World:", username);
    } catch (err) {
      console.error("Signup Error:", err);
      if (callback)
        callback({ success: false, message: "Something went wrong." });
      socket.emit("authError", "Something went wrong.");
    }
  });

  // LOGIN
  socket.on("login", async ({ username, password }) => {
    if (!username || !password) {
      return socket.emit("authError", "Missing fields");
    }

    // Check if user already logged in on another socket
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

      // Store user info in memory (without password)
      users[username] = {
        id: user.id,
        socketId: socket.id,
      };

      // Attach to socket for later use
      socket.userId = user.id;
      socket.username = username;

      socket.emit("authSuccess", { username });
      console.log("Player Logged In:", username);
    } catch (err) {
      console.error("Login Error:", err);
      socket.emit("authError", "Something went wrong.");
    }
  });
}
