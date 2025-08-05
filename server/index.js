import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const PORT = process.env.PORT || 3000;
const players = {};

io.on("connection", (socket) => {
  console.log(`Player connected: ${socket.id}`);

  players[socket.id] = { x: 250, y: 250 };

  // Send the new player the list of current players
  socket.emit("currentPlayers", players);

  // Notify others of the new player
  socket.broadcast.emit("newPlayer", {
    id: socket.id,
    x: 250,
    y: 250,
  });

  socket.on("playerMovement", (data) => {
    if (players[socket.id]) {
      players[socket.id].x = data.x;
      players[socket.id].y = data.y;

      socket.broadcast.emit("playerMoved", {
        id: socket.id,
        x: data.x,
        y: data.y,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log(`Player disconnected: ${socket.id}`);
    delete players[socket.id];
    io.emit("playerDisconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
