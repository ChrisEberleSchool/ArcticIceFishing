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
    const userId = socket.userId; // Ensure userId is set on the socket during authentication

    if (!userId) {
      socket.emit("error", "Not authenticated");
      return;
    }

    try {
      // Upsert biggest fish logic
      const existingFish = await prisma.biggestFish.findUnique({
        where: {
          userId_fishName: {
            userId,
            fishName: fishData.name,
          },
        },
      });

      if (!existingFish) {
        await prisma.biggestFish.create({
          data: {
            userId,
            fishName: fishData.name,
            length: fishData.length,
            tier: fishData.tier,
            reward: fishData.reward,
          },
        });
      } else if (fishData.length > existingFish.length) {
        await prisma.biggestFish.update({
          where: { id: existingFish.id },
          data: {
            length: fishData.length,
            tier: fishData.tier,
            reward: fishData.reward,
            caughtAt: new Date(),
          },
        });
      }

      // Increment fishCaught for user
      await prisma.user.update({
        where: { id: userId },
        data: {
          fishCaught: {
            increment: 1,
          },
        },
      });

      // Get updated fishCaught count
      const updatedUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { fishCaught: true },
      });

      // Emit confirmation with updated fishCaught count
      socket.emit("fishCatchConfirmed", {
        ...fishData,
        fishCaught: updatedUser.fishCaught,
      });
    } catch (error) {
      console.error("Error updating biggest fish or fishCaught:", error);
      socket.emit("error", "Failed to update fish data");
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
