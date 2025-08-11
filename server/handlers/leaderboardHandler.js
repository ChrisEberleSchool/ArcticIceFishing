// Example server-side function you should add and call via socket event "getLeaderboard"
import prisma from "../db/prismaClient.js";

async function getLeaderboard() {
  const topFish = await prisma.BiggestFish.findMany({
    orderBy: { length: "desc" },
    take: 5,
    include: { user: true },
  });

  return topFish.map((fish) => ({
    username: fish.user.username,
    tier: fish.tier,
    fishName: fish.fishName,
    length: fish.length,
    caughtAt: fish.caughtAt.toISOString(),
  }));
}

export default function leaderboardHandler(socket, io) {
  socket.on("requestLeaderboard", async () => {
    try {
      const data = await getLeaderboard();
      socket.emit("leaderboardData", data);
    } catch (error) {
      console.error("Failed to get leaderboard:", error);
      socket.emit("error", "Failed to fetch leaderboard");
    }
  });
}
