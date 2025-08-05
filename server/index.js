import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 3000;

// Store players who have initialized
const players = {};

// On client connection
io.on("connection", (socket) => {
  console.log(`Player connected: ${socket.id}`);

  // Wait for client to send initPlayer with username (or any info)
  socket.on("initPlayer", (data) => {
    // Example data could include username, initial position, etc
    players[socket.id] = {
      x: 250,
      y: 250,
      username: data.username || "Anonymous",
      id: socket.id,
    };

    // Send current players to the new player
    socket.emit("currentPlayers", players);

    // Notify others about the new player
    socket.broadcast.emit("newPlayer", players[socket.id]);

    console.log(
      `Player initialized: ${socket.id} (${players[socket.id].username})`
    );
  });

  // Player movement update
  socket.on("playerMovement", (data) => {
    if (!players[socket.id]) return; // Ignore if player not initialized

    players[socket.id].x = data.x;
    players[socket.id].y = data.y;
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    if (players[socket.id]) {
      console.log(
        `Player disconnected: ${socket.id} (${players[socket.id].username})`
      );
      delete players[socket.id];

      // Notify all clients player left
      io.emit("playerDisconnected", socket.id);
    }
  });
});

// Server game loop: broadcast player states every 50ms (~20fps)
setInterval(() => {
  io.emit("playersUpdate", players);
}, 50);

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
