import { fishingHoles } from "../state/fishingHoles.js";
import prisma from "../db/prismaClient.js";

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

  socket.on("fishCaught", async (fishData) => {
    // fishData could contain { name, length, tier, reward }
    if (!socket.userId) {
      console.warn(`fishCaught event without userId for socket ${socket.id}`);
      return;
    }

    try {
      // Increment total fish caught
      await prisma.user.update({
        where: { id: socket.userId },
        data: {
          fishCaught: { increment: 1 },
          coins: { increment: fishData.reward || 0 },
        },
      });

      // Optionally track biggest fish for that type
      await prisma.biggestFish.upsert({
        where: {
          userId_fishName: {
            userId: socket.userId,
            fishName: fishData.name,
          },
        },
        update: {
          length: Math.max(fishData.length, prisma.length),
          reward: fishData.reward,
          tier: fishData.tier,
          caughtAt: new Date(),
        },
        create: {
          userId: socket.userId,
          fishName: fishData.name,
          length: fishData.length,
          tier: fishData.tier,
          reward: fishData.reward,
        },
      });

      // Notify the client that the update succeeded
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
      const [x, y] = key.split(",").map(Number);
      io.emit("fishingHoleUpdate", { x, y, occupiedBy: null });
    }
  }
}
