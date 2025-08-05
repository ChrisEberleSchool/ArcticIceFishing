import "./style.css";
import Phaser from "./phaser";
import GameScene from "./scenes/GameScene.js";
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

new Phaser.Game(config);
