import { users } from "../state/users.js";
import { players } from "../state/players.js";
import { fishingHoles } from "../state/fishingHoles.js";

export default function playerHandler(socket, io) {
  socket.on("initPlayer", ({ username }) => {
    if (!users[username] || users[username].socketId !== socket.id) {
      return socket.emit("authError", "Unauthorized");
    }

    players[socket.id] = { id: socket.id, username, x: 250, y: 250 };
    socket.emit("currentPlayers", players);
    socket.emit("currentFishingHoles", fishingHoles);
    socket.broadcast.emit("newPlayer", players[socket.id]);
  });

  socket.on("playerMovement", ({ x, y }) => {
    if (players[socket.id]) {
      players[socket.id].x = x;
      players[socket.id].y = y;
    }
  });
}

export function onDisconnect(socket, io) {
  if (players[socket.id]) {
    const username = players[socket.id].username;
    delete players[socket.id];
    io.emit("playerDisconnected", socket.id);
    console.log("Disconnected:", username);
  }
}
