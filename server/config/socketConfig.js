import authHandler from "../handlers/authHandler.js";
import playerHandler, {
  onDisconnect as playerOnDisconnect,
  startPeriodicCleanup,
} from "../handlers/playerHandler.js";
import { players } from "../state/players.js";

import fishingHandler, {
  onDisconnect as fishingOnDisconnect,
} from "../handlers/fishingHandler.js";
import { fishingHoles } from "../state/fishingHoles.js";

import chatHandler from "../handlers/chatHandler.js";

import leaderboardHandler from "../handlers/leaderboardHandler.js";

export default function socketConfig(io) {
  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    authHandler(socket, io);
    playerHandler(socket, io);
    fishingHandler(socket, io);
    chatHandler(socket, io);
    leaderboardHandler(socket, io);

    // TODO :: Remove this
    // Send initial fishing holes state to the newly connected player
    for (const key in fishingHoles) {
      const [x, y] = key.split(",").map(Number);
      socket.emit("fishingHoleUpdate", { x, y, occupiedBy: fishingHoles[key] });
    }

    socket.on("disconnect", () => {
      fishingOnDisconnect(socket, io);
      playerOnDisconnect(socket, io);
    });
  });

  startPeriodicCleanup(io);

  setInterval(async () => {
    io.emit("playersUpdate", players);
  }, 100);
}
