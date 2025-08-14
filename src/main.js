import "./style.css";
import Phaser from "phaser";
import socket from "./network/socket.js";
import sizes from "./config/gameConfig.js";

import BootScene from "./scenes/BootScene.js";
import AuthScene from "./scenes/AuthScene.js";
import LoadingScene from "./scenes/LoadingScene.js";
import GameScene from "./scenes/GameScene.js";
import UIScene from "./scenes/UIScene.js";

// ----------------------
// Elements
// ----------------------
const landingPage = document.getElementById("landingPage");
//const loginScreen = document.getElementById("loginScreen");
const playBtn = document.getElementById("playNowBtn");
const gameCanvasParent = document.getElementById("gameCanvasParent");

// ----------------------
// Play Now button
// ----------------------
playBtn.addEventListener("click", () => {
  landingPage.style.display = "none";
  gameCanvasParent.style.display = "block";

  const config = {
    type: Phaser.WEBGL,
    width: sizes.width,
    height: sizes.height,
    parent: gameCanvasParent,
    dom: { createContainer: true },
    pixelArt: true,
    roundPixels: true,
    physics: { default: "arcade", arcade: { gravity: { y: 0 }, debug: false } },
    scene: [BootScene, AuthScene, LoadingScene, GameScene, UIScene],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
  };

  const game = new Phaser.Game(config); // Phaser starts now

  // Manually trigger Phaser to re-fit when window resizes
  window.addEventListener("resize", () => {
    // Use Phaser.Scale.FIT
    game.scale.resize(sizes.width, sizes.height);
  });
});
