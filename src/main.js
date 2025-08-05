import Phaser from "phaser";
import GameScene from "./scenes/GameScene.js";
import sizes from "./config/gameConfig.js";
import { connectSocket } from "./network/socket.js";

// DOM elements
const loginForm = document.getElementById("login-form");
const authScreen = document.getElementById("auth-screen");
const gameScreen = document.getElementById("game-screen");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = e.target.username.value;
  const password = e.target.password.value;

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (res.ok) {
    const { username } = await res.json();

    authScreen.style.display = "none";
    gameScreen.style.display = "block";

    const socket = connectSocket(username);
    startGame(socket, username);
  } else {
    alert("Login failed.");
  }
});

function startGame(socket, username) {
  const config = {
    type: Phaser.WEBGL,
    width: sizes.width,
    height: sizes.height,
    canvas: document.getElementById("gameCanvas"),
    pixelArt: true,
    physics: {
      default: "arcade",
      arcade: { gravity: { y: 0 }, debug: true },
    },
    scene: [GameScene],
    data: { socket, username },
  };

  new Phaser.Game(config);
}
