import express from "express";
import http from "http";
import { Server } from "socket.io";
import bcrypt from "bcrypt";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 3000;

const users = {};
const players = {};

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  socket.on("signup", async ({ username, password }) => {
    if (!username || !password)
      return socket.emit("authError", "Missing fields");
    if (users[username]) return socket.emit("authError", "Username exists");

    const hash = await bcrypt.hash(password, 10);
    users[username] = { password: hash, socketId: socket.id };

    // Treat signup as an authenticated session
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

  socket.on("initPlayer", ({ username }) => {
    if (!users[username] || users[username].socketId !== socket.id) {
      return socket.emit("authError", "Unauthorized");
    }

    players[socket.id] = { id: socket.id, username, x: 250, y: 250 };
    socket.emit("currentPlayers", players);
    socket.broadcast.emit("newPlayer", players[socket.id]);
  });

  socket.on("playerMovement", (data) => {
    if (!players[socket.id]) return;
    players[socket.id].x = data.x;
    players[socket.id].y = data.y;
  });

  socket.on("disconnect", () => {
    if (players[socket.id]) {
      const username = players[socket.id].username;
      delete players[socket.id];
      io.emit("playerDisconnected", socket.id);
      console.log("Disconnected:", username);
    }

    for (const name in users) {
      if (users[name].socketId === socket.id) {
        users[name].socketId = null;
      }
    }
  });
});

setInterval(() => {
  io.emit("playersUpdate", players);
}, 50);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
