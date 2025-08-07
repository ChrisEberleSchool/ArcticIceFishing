import "./style.css";
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
  roundPixels: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
  scene: [GameScene],
};

// Create the Phaser game once on page load
const game = new Phaser.Game(config);

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const isSignup = document.getElementById("authMode").value === "signup";

  if (!username || !password) return alert("Both fields required");

  const authEvent = isSignup ? "signup" : "login";
  socket.emit(authEvent, { username, password });

  socket.once("authSuccess", (data) => {
    const uname = data?.username || username;

    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("gameCanvas").style.display = "block";

    // Start the game scene with username data
    game.scene.start("scene-game", { username: uname });
  });

  socket.once("authError", (msg) => {
    alert("Auth error: " + msg);
  });
});
