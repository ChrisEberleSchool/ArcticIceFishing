import { fishingHoles } from "../state/fishingHoles.js";

export default function fishingHandler(socket, io) {
  socket.on("tryOccupyFishingHole", ({ x, y }) => {
    const key = `${x},${y}`;
    if (!(key in fishingHoles)) return socket.emit("occupyFailed", { x, y });

    if (fishingHoles[key] === null) {
      fishingHoles[key] = socket.id;
      socket.emit("occupySuccess", { x, y });
      io.emit("fishingHoleUpdate", { x, y, occupiedBy: socket.id });
    } else {
      socket.emit("occupyFailed", { x, y });
    }
  });

  socket.on("releaseFishingHole", ({ x, y }) => {
    const key = `${x},${y}`;
    if (fishingHoles[key] === socket.id) {
      fishingHoles[key] = null;
      io.emit("fishingHoleUpdate", { x, y, occupiedBy: null });
    }
  });

  socket.on("requestFishingHoleStates", () => {
    // Send all fishing holes at once
    socket.emit("fishingHoleStates", fishingHoles);
  });
}

export function onDisconnect(socket, io) {
  for (const key in fishingHoles) {
    if (fishingHoles[key] === socket.id) {
      fishingHoles[key] = null;
      const [x, y] = key.split(",").map(Number);
      io.emit("fishingHoleUpdate", { x, y, occupiedBy: null });
    }
  }
}
