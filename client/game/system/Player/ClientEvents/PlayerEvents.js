import RemotePlayer from "../Remote/RemotePlayer.js";

// Helper: Add a remote player to scene.players
function addOtherPlayer(scene, id, info) {
  const remotePlayer = new RemotePlayer(scene, info.x, info.y, info.username);
  scene.players[id] = remotePlayer;
}

export default function registerPlayerEvents(scene, socket) {
  socket.on("currentPlayers", (players) => {
    Object.entries(players).forEach(([id, playerData]) => {
      if (id === socket.id) {
        // Skip local player since it's already created
        return;
      }

      if (!scene.players[id]) {
        addOtherPlayer(scene, id, playerData);
      } else {
        // Update existing remote player position
        scene.players[id].sprite.x = playerData.x;
        scene.players[id].sprite.y = playerData.y;
      }
    });
  });

  socket.on("newPlayer", (playerInfo) => {
    if (!scene.players[playerInfo.id] && playerInfo.id !== socket.id) {
      addOtherPlayer(scene, playerInfo.id, playerInfo);
    }
  });

  socket.on("playersUpdate", (players) => {
    for (const id in players) {
      if (id === socket.id) continue;

      const info = players[id];

      if (!scene.players[id]) {
        addOtherPlayer(scene, id, info);
      } else {
        scene.players[id].updateFromServer(info);
      }
    }
  });

  socket.on("playerDisconnected", (id) => {
    if (scene.players[id]) {
      scene.players[id].destroy();
      delete scene.players[id];
    }
  });
}
