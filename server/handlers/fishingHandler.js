import { fishingHoles } from "../state/fishingHoles.js";
import prisma from "../db/prismaClient.js";

const fishingCooldowns = {}; // key: "x,y" -> timestamp
const tileLocks = {}; // key: "x,y" -> boolean

export default function fishingHandler(socket, io) {
  // --- Occupy a fishing hole ---
  socket.on("tryOccupyFishingHole", ({ x, y }) => {
    const key = `${x},${y}`;
    const now = Date.now();

    if (!(key in fishingHoles)) return socket.emit("occupyFailed", { x, y });
    if (fishingCooldowns[key] && fishingCooldowns[key] > now)
      return socket.emit("occupyFailed", { x, y });

    // Acquire lock
    if (tileLocks[key]) return socket.emit("occupyFailed", { x, y });
    tileLocks[key] = true;

    try {
      if (!fishingHoles[key]) {
        fishingHoles[key] = socket.id;
        socket.emit("occupySuccess", { x, y });
        io.emit("fishingHoleUpdate", { x, y, occupiedBy: socket.id });
      } else {
        socket.emit("occupyFailed", { x, y });
      }
    } finally {
      tileLocks[key] = false;
    }
  });

  // --- Release a fishing hole ---
  socket.on("releaseFishingHole", ({ x, y }) => {
    const key = `${x},${y}`;
    if (fishingHoles[key] === socket.id) {
      fishingHoles[key] = null;
      fishingCooldowns[key] = Date.now() + 2000;
      io.emit("fishingHoleUpdate", { x, y, occupiedBy: null });
    }
  });

  // --- Sync all holes to client ---
  socket.on("requestFishingHoleStates", () => {
    socket.emit("fishingHoleStates", fishingHoles);
  });

  // --- Fish caught ---
  socket.on("fishCaught", async (fishData) => {
    if (!socket.userId) return console.warn(`Missing userId for ${socket.id}`);

    try {
      await prisma.user.update({
        where: { id: socket.userId },
        data: {
          fishCaught: { increment: 1 },
          coins: { increment: fishData.reward || 0 },
        },
      });

      const existingFish = await prisma.BiggestFish.findUnique({
        where: {
          userId_fishName: { userId: socket.userId, fishName: fishData.name },
        },
      });

      if (!existingFish) {
        await prisma.BiggestFish.create({
          data: {
            userId: socket.userId,
            fishName: fishData.name,
            length: fishData.length,
            tier: fishData.tier,
            reward: fishData.reward,
          },
        });
      } else if (fishData.length > existingFish.length) {
        await prisma.BiggestFish.update({
          where: { id: existingFish.id },
          data: {
            length: fishData.length,
            tier: fishData.tier,
            reward: fishData.reward,
            caughtAt: new Date(),
          },
        });
      }

      socket.emit("fishCaughtSuccess", {
        fishName: fishData.name,
        length: fishData.length,
        reward: fishData.reward,
      });
    } catch (err) {
      console.error("fishCaught error:", err);
      socket.emit("fishCaughtError", { message: "Could not save fish" });
    }
  });
}

// --- Centralized disconnect handler ---
export function onDisconnect(socket, io) {
  for (const key in fishingHoles) {
    if (fishingHoles[key] === socket.id) {
      fishingHoles[key] = null;
      const [x, y] = key.split(",").map(Number);
      io.emit("fishingHoleUpdate", { x, y, occupiedBy: null });
    }
  }
}
