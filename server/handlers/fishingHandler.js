import { fishingHoles } from "../state/fishingHoles.js";
import prisma from "../db/prismaClient.js";

// Store cooldown timestamps per tile
const fishingCooldowns = {};

export default function fishingHandler(socket, io) {
  socket.on("tryOccupyFishingHole", ({ x, y }) => {
    const key = `${x},${y}`;
    const now = Date.now();

    // Check if tile exists
    if (!(key in fishingHoles)) return socket.emit("occupyFailed", { x, y });

    // Check if tile is on cooldown
    if (fishingCooldowns[key] && fishingCooldowns[key] > now) {
      return socket.emit("occupyFailed", { x, y });
    }

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

      // Start a 2-second cooldown for this tile
      fishingCooldowns[key] = Date.now() + 1000;

      io.emit("fishingHoleUpdate", { x, y, occupiedBy: null });
    }
  });

  socket.on("requestFishingHoleStates", () => {
    socket.emit("fishingHoleStates", fishingHoles);
  });

  socket.on("fishCaught", async (fishData) => {
    if (!socket.userId) {
      console.warn(`fishCaught event without userId for socket ${socket.id}`);
      return;
    }

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
          userId_fishName: {
            userId: socket.userId,
            fishName: fishData.name,
          },
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

      console.log(
        `User ${socket.userId} caught a ${fishData.tier} ${fishData.name}`
      );
    } catch (err) {
      console.error("Error handling fishCaught:", err);
      socket.emit("fishCaughtError", { message: "Could not save fish" });
    }
  });
}

export function onDisconnect(socket, io) {
  for (const key in fishingHoles) {
    if (fishingHoles[key] === socket.id) {
      fishingHoles[key] = null;

      // Start cooldown on disconnect as well
      fishingCooldowns[key] = Date.now() + 2000;

      const [x, y] = key.split(",").map(Number);
      io.emit("fishingHoleUpdate", { x, y, occupiedBy: null });
    }
  }
}
