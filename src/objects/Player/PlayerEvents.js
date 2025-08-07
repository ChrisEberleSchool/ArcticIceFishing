import RemotePlayer from "./RemotePlayer";

// This function creates and stores a remote player instance
function addOtherPlayer(scene, id, info) {
  const remotePlayer = new RemotePlayer(scene, info.x, info.y, info.username);
  scene.players[id] = remotePlayer;
}

export default function registerPlayerEvents(scene, socket) {
  socket.on("currentPlayers", (players) => {
    for (const id in players) {
      if (id !== socket.id && !scene.players[id]) {
        addOtherPlayer(scene, id, players[id]);
      }
    }
  });

  socket.on("newPlayer", (playerInfo) => {
    if (!scene.players[playerInfo.id]) {
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
      scene.players[id].destroy(); // ✅ use class method
      delete scene.players[id];
    }
  });
}
