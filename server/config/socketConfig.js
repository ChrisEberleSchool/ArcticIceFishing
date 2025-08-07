import authHandler from "../handlers/authHandler.js";
import playerHandler, {
  onDisconnect as playerOnDisconnect,
} from "../handlers/playerHandler.js";

import fishingHandler, {
  onDisconnect as fishingOnDisconnect,
} from "../handlers/fishingHandler.js";
import { fishingHoles } from "../state/fishingHoles.js";

export default function socketConfig(io) {
  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    authHandler(socket, io);
    playerHandler(socket, io);
    fishingHandler(socket, io);

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

  setInterval(async () => {
    const { players } = await import("../state/players.js");
    io.emit("playersUpdate", players);
  }, 50);
}
