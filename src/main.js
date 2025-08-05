import Phaser from "phaser";
import GameScene from "./scenes/GameScene.js";
import socket from "/network/socket.js";
import sizes from "./config/gameConfig.js";

const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: document.getElementById("gameCanvas"),
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
  scene: [GameScene],
};

// Handle login/signup form
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const isSignup = document.getElementById("authMode").value === "signup";

  if (!username || !password) return alert("Both fields required");

  const authEvent = isSignup ? "signup" : "login";
  socket.emit(authEvent, { username, password });

  socket.once("authSuccess", () => {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("gameCanvas").style.display = "block";

    const game = new Phaser.Game(config);
    game.scene.start("scene-game", { username });
  });

  socket.once("authError", (msg) => {
    alert("Auth error: " + msg);
  });
});
