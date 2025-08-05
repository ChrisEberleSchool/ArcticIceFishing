import Phaser from "phaser";
import GameScene from "./scenes/GameScene.js";
import sizes from "./config/gameConfig.js";
import { connectSocket } from "./network/socket.js";

const loginForm = document.getElementById("login-form");
const signupButton = document.getElementById("signup-button");
const authScreen = document.getElementById("auth-screen");
const gameScreen = document.getElementById("game-screen");

const BACKEND_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://arcticicefishing.onrender.com";

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = e.target.username.value;
  const password = e.target.password.value;

  const res = await fetch(`${BACKEND_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (res.ok) {
    const { username } = await res.json();
    launchGame(username);
  } else {
    alert("Login failed. Try again.");
  }
});

signupButton.addEventListener("click", async () => {
  const username = loginForm.username.value;
  const password = loginForm.password.value;

  const res = await fetch(`${BACKEND_URL}/api/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (res.ok) {
    alert("Signup successful! You can now log in.");
  } else {
    alert("Signup failed. User may already exist.");
  }
});

function launchGame(username) {
  authScreen.style.display = "none";
  gameScreen.style.display = "block";

  const socket = connectSocket(username);

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
