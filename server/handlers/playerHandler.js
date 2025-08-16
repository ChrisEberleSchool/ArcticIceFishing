import { users } from "../state/users.js";
import { players } from "../state/players.js";
import { fishingHoles } from "../state/fishingHoles.js";
import prisma from "../db/prismaClient.js";

export default function playerHandler(socket, io) {
  socket.on("initPlayer", async ({ username }) => {
    if (!users[username] || users[username].socketId !== socket.id) {
      return socket.emit("authError", "Unauthorized");
    }

    try {
      const dbUser = await prisma.user.findUnique({ where: { username } });
      if (!dbUser) {
        return socket.emit("authError", "User not found in DB");
      }

      players[socket.id] = {
        id: socket.id,
        username,
        x: dbUser.x ?? 250,
        y: dbUser.y ?? 250,
        fishing: false,
        fishingState: null,
        facing: "down",
        coins: dbUser.coins ?? 0,
        fishCaught: dbUser.fishCaught ?? 0,
      };

      socket.emit("currentPlayers", players);
      socket.emit("currentFishingHoles", fishingHoles);

      socket.broadcast.emit("newPlayer", players[socket.id]);

      console.log(`Initialized player: ${username}`);
    } catch (err) {
      console.error("initPlayer DB error:", err);
      socket.emit("authError", "Failed to load player data");
    }
  });

  // Update player position/fishing state/facing in memory only
  socket.on(
    "playerMovement",
    ({ x, y, fishing, fishingState, facing, isMoving }) => {
      const player = players[socket.id];
      if (!player) return;

      player.x = x;
      player.y = y;
      player.fishing = fishing;
      player.fishingState = fishingState;
      player.facing = facing;
      player.isMoving = isMoving;
    }
  );

  // These calls can be throttled
  socket.on("playerStats", async ({ coins, fishCaught }) => {
    const player = players[socket.id];
    if (!player) return;

    player.coins = coins;
    player.fishCaught = fishCaught;

    try {
      await prisma.user.update({
        where: { username: player.username },
        data: {
          coins: player.coins,
          fishCaught: player.fishCaught,
        },
      });
    } catch (err) {
      console.error("Failed to update player stats:", err);
    }
  });
}

// On disconnect, save all player data to DB
export async function onDisconnect(socket, io) {
  const player = players[socket.id];
  if (!player) return;

  try {
    await prisma.user.update({
      where: { username: player.username },
      data: {
        x: player.x,
        y: player.y,
        coins: player.coins,
        fishCaught: player.fishCaught,
      },
    });
    console.log(`Saved player data for ${player.username} on disconnect.`);
  } catch (err) {
    console.error("Failed to save player data on disconnect:", err);
  }

  delete players[socket.id];

  // **Remove user from the users map**
  if (users[player.username] && users[player.username].socketId === socket.id) {
    delete users[player.username];
    console.log(`Freed username: ${player.username}`);
  }

  io.emit("playerDisconnected", socket.id);
  console.log(`Player disconnected: ${player.username}`);
}

// Run cleanup
let cleanupStarted = false;
export function startPeriodicCleanup(io) {
  if (cleanupStarted) return;
  cleanupStarted = true;

  setInterval(async () => {
    try {
      const activeSocketIds = new Set([...io.sockets.sockets.keys()]);

      // Check players for stale sockets
      for (const socketId of Object.keys(players)) {
        if (!activeSocketIds.has(socketId)) {
          const player = players[socketId];

          // Save player data before removal
          try {
            await prisma.user.update({
              where: { username: player.username },
              data: {
                x: player.x,
                y: player.y,
                coins: player.coins,
                fishCaught: player.fishCaught,
              },
            });
            console.log(
              `Saved player data for ${player.username} during cleanup.`
            );
          } catch (err) {
            console.error(
              `Failed to save player data for ${player.username} during cleanup:`,
              err
            );
          }

          // Delete from players map
          delete players[socketId];

          // Delete from users map if it matches this socketId
          if (
            users[player.username] &&
            users[player.username].socketId === socketId
          ) {
            delete users[player.username];
            console.log(`Freed username: ${player.username} during cleanup.`);
          }

          // Notify clients about disconnection
          io.emit("playerDisconnected", socketId);
          console.log(`Cleaned up disconnected player: ${player.username}`);
        }
      }
    } catch (err) {
      console.error("Failed to emit players update:", err);
    }
  }, 10000);
}
