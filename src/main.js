import "./style.css";
import Phaser from "phaser";
import GameScene from "./scenes/GameScene.js";
import UIScene from "./scenes/UIScene.js";
import socket from "./network/socket.js";
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
      debug: false,
    },
  },
  scene: [],
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

    if (!game.scene.getScene("scene-game")) {
      game.scene.add("scene-game", GameScene, true, { username: uname }); // autoStart=true
    } else {
      game.scene.start("scene-game", { username: uname });
    }

    if (!game.scene.getScene("scene-ui")) {
      game.scene.add("scene-ui", UIScene, false); // autoStart=false
    }

    if (!game.scene.isActive("scene-ui")) {
      game.scene.start("scene-ui", UIScene, true); // launch parallel
    }

    game.scene.bringToTop("scene-ui");
  });

  socket.once("authError", (msg) => {
    alert("Auth error: " + msg);
  });
});
