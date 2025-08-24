import Phaser from "phaser";
import sizes from "./config/gameConfig.js";
import BootScene from "./scenes/BootScene.js";
import AuthScene from "./scenes/AuthScene.js";
import LoadingScene from "./scenes/LoadingScene.js";
import GameScene from "./scenes/GameScene.js";
import UIScene from "./scenes/UIScene.js";

// Export function to start Phaser
export function startGame(parentElementOrId) {
  const parent =
    typeof parentElementOrId === "string"
      ? document.getElementById(parentElementOrId)
      : parentElementOrId;

  if (!parent) {
    console.error("startGame: parent element not found", parentElementOrId);
    return null;
  }

  const config = {
    type: Phaser.WEBGL,
    width: sizes.width,
    height: sizes.height,
    parent: parent,
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

  const game = new Phaser.Game(config);

  window.addEventListener("resize", () => {
    game.scale.FIT;
  });

  return {
    destroy: () => {
      game.destroy(true);
      window.removeEventListener("resize");
    },
  };
}
