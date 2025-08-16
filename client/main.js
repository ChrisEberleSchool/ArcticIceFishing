import "./style.css";
import "./aboutStyle.css";
import "./contactStyle.css";
import "./whatsnewStyle.css";

import Phaser from "phaser";
import socket from "./network/socket.js";
import sizes from "./config/gameConfig.js";

import BootScene from "./scenes/BootScene.js";
import AuthScene from "./scenes/AuthScene.js";
import LoadingScene from "./scenes/LoadingScene.js";
import GameScene from "./scenes/GameScene.js";
import UIScene from "./scenes/UIScene.js";

// Catch global JS errors
window.onerror = function (message, source, lineno, colno, error) {
  socket.emit("clientError", {
    message,
    source,
    line: lineno,
    column: colno,
    stack: error?.stack,
    userAgent: navigator.userAgent,
  });
};

// Catch unhandled promise rejections
window.addEventListener("unhandledrejection", function (event) {
  socket.emit("clientError", {
    message: event.reason?.message || event.reason,
    stack: event.reason?.stack,
    userAgent: navigator.userAgent,
  });
});

// ----------------------
// Elements
// ----------------------
const landingPage = document.getElementById("landingPage");
const playBtn = document.getElementById("playNowBtn");
const gameCanvasParent = document.getElementById("gameCanvasParent");

// ----------------------
// Play Now button
// ----------------------
if (landingPage && playBtn && gameCanvasParent) {
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
      physics: {
        default: "arcade",
        arcade: { gravity: { y: 0 }, debug: false },
      },
      scene: [BootScene, AuthScene, LoadingScene, GameScene, UIScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    const game = new Phaser.Game(config); // Phaser starts now

    window.addEventListener("resize", () => {
      game.scale.FIT;
    });
  });
}
