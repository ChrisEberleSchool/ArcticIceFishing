// This function creates an instance of another player on the client to show multiplayer players
export function addOtherPlayer(scene, id, info) {
  const sprite = scene.add
    .sprite(info.x, info.y, "playerIdleSheet")
    .setScale(2)
    .setOrigin(0.5);
  sprite.play("idle");

  const nameText = scene.add
    .text(info.x, info.y - 24, info.username, {
      fontSize: "12px",
      color: "#ffffff",
      fontFamily: "Arial",
      stroke: "#000",
      strokeThickness: 3,
    })
    .setOrigin(0.5);

  scene.players[id] = {
    sprite,
    nameText,
    target: { x: info.x, y: info.y },
  };
}

export default function registerPlayerEvents(scene, socket) {
  socket.on("currentPlayers", (players) => {
    for (const id in players) {
      if (id !== socket.id && !scene.players[id]) {
        addOtherPlayer(id, players[id]);
      }
    }
  });

  socket.on("newPlayer", (playerInfo) => {
    if (!scene.players[playerInfo.id]) {
      addOtherPlayer(scene, id, players[id]);
    }
  });

  socket.on("playersUpdate", (players) => {
    for (const id in players) {
      if (id === socket.id) continue;
      const info = players[id];
      if (!scene.players[id]) {
        addOtherPlayer(scene, id, players[id]);
      }
      scene.players[id].target = { x: info.x, y: info.y };
    }

    for (const id in scene.players) {
      if (!players[id]) {
        scene.players[id].sprite.destroy();
        scene.players[id].nameText.destroy();
        delete scene.players[id];
      }
    }
  });

  socket.on("playerDisconnected", (id) => {
    if (scene.players[id]) {
      scene.players[id].sprite.destroy();
      scene.players[id].nameText.destroy();
      delete scene.players[id];
    }
  });
}
