import Phaser from "phaser";
import sizes from "./game/Config/gameConfig.js";
import BootScene from "./game/scenes/BootScene.js";
import AuthScene from "./game/scenes/AuthScene.js";
import LoadingScene from "./game/scenes/LoadingScene.js";
import GameScene from "./game/scenes/GameScene.js";
import UIScene from "./game/scenes/UIScene.js";

// Export function to start Phaser
export function startGame(parentElementOrId) {
  const config = {
    type: Phaser.WEBGL,
    width: sizes.width,
    height: sizes.height,
    parent: parentElementOrId,
    dom: { createContainer: true },
    pixelArt: true,
    roundPixels: true,
    physics: { default: "arcade", arcade: { gravity: { y: 0 }, debug: false } },
    scene: [BootScene, AuthScene, LoadingScene, GameScene, UIScene],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: sizes.width,
      height: sizes.height,
    },
  };

  const game = new Phaser.Game(config);

  return {
    destroy: () => {
      game.destroy(true);
    },
  };
}
