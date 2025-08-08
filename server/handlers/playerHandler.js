import { users } from "../state/users.js";
import { players } from "../state/players.js";
import { fishingHoles } from "../state/fishingHoles.js";
import prisma from "../db/prismaClient.js";

export default function playerHandler(socket, io) {
  socket.on("initPlayer", async ({ username }) => {
    // Validate session
    if (!users[username] || users[username].socketId !== socket.id) {
      return socket.emit("authError", "Unauthorized");
    }

    try {
      // Load player from DB
      const dbUser = await prisma.user.findUnique({ where: { username } });
      if (!dbUser) {
        return socket.emit("authError", "User not found in DB");
      }

      // Register player using DB position
      players[socket.id] = {
        id: socket.id,
        username,
        x: dbUser.x ?? 250,
        y: dbUser.y ?? 250,
        fishing: false,
        fishingState: null,
        facing: "down",
        coins: dbUser.coins,
        fishCaught: dbUser.fishCaught,
      };

      // Send game state to this player
      socket.emit("currentPlayers", players);
      socket.emit("currentFishingHoles", fishingHoles);

      // Notify other players
      socket.broadcast.emit("newPlayer", players[socket.id]);

      console.log(`Initialized player: ${username}`);
    } catch (err) {
      console.error("initPlayer DB error:", err);
      socket.emit("authError", "Failed to load player data");
    }
  });

  socket.on(
    "playerMovement",
    async ({ x, y, fishing, fishingState, facing }) => {
      const player = players[socket.id];
      if (!player) return;

      player.x = x;
      player.y = y;
      player.fishing = fishing;
      player.fishingState = fishingState;
      player.facing = facing;

      // Optionally update position in DB
      try {
        await prisma.user.update({
          where: { username: player.username },
          data: { x, y },
        });
      } catch (err) {
        console.error("Failed to update player position in DB:", err);
      }
    }
  );
}

// Handle disconnection
export function onDisconnect(socket, io) {
  if (players[socket.id]) {
    const username = players[socket.id].username;
    delete players[socket.id];
    io.emit("playerDisconnected", socket.id);
    console.log(`Player disconnected: ${username}`);
  }
}
