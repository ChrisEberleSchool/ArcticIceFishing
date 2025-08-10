// src/ui/CoinUI.js
import Phaser from "phaser";

const FIRE_ANIM_FRAMERATE = 14;

export default class FishUI {
  constructor(scene, x, y) {
    this.scene = scene;
  }

  static preload(scene) {
    scene.load.spritesheet(
      "fire-common",
      "./assets/ui/fireSprites/192/greenWarp.png",
      {
        frameWidth: 192,
        frameHeight: 192,
      }
    );
    scene.load.spritesheet(
      "fire-uncommon",
      "./assets/ui/fireSprites/192/blueWarp.png",
      {
        frameWidth: 192,
        frameHeight: 192,
      }
    );
    scene.load.spritesheet(
      "fire-rare",
      "./assets/ui/fireSprites/192/pinkWarp.png",
      {
        frameWidth: 192,
        frameHeight: 192,
      }
    );
    scene.load.spritesheet(
      "fire-epic",
      "./assets/ui/fireSprites/192/redWarp.png",
      {
        frameWidth: 192,
        frameHeight: 192,
      }
    );
    scene.load.spritesheet(
      "fire-legendary",
      "./assets/ui/fireSprites/192/yellowWarp.png",
      {
        frameWidth: 192,
        frameHeight: 192,
      }
    );
  }

  static createAnimations(scene) {
    // Fire animations
    scene.anims.create({
      key: "fire-common",
      frames: scene.anims.generateFrameNumbers("fire-common", {
        start: 0,
        end: 14,
      }),
      frameRate: FIRE_ANIM_FRAMERATE,
      repeat: -1, // loop forever
    });

    scene.anims.create({
      key: "fire-uncommon",
      frames: scene.anims.generateFrameNumbers("fire-uncommon", {
        start: 0,
        end: 14,
      }),
      frameRate: FIRE_ANIM_FRAMERATE,
      repeat: -1,
    });

    scene.anims.create({
      key: "fire-rare",
      frames: scene.anims.generateFrameNumbers("fire-rare", {
        start: 0,
        end: 14,
      }),
      frameRate: FIRE_ANIM_FRAMERATE,
      repeat: -1,
    });

    scene.anims.create({
      key: "fire-legendary",
      frames: scene.anims.generateFrameNumbers("fire-legendary", {
        start: 0,
        end: 14,
      }),
      frameRate: FIRE_ANIM_FRAMERATE,
      repeat: -1,
    });
  }

  showCatchUI(fish) {
    // Remove any previous UI if still visible
    if (this.catchUI) {
      this.catchUI.destroy();
    }

    const centerX = this.scene.cameras.main.centerX;
    const centerY = 250;

    // Create container for the UI
    this.catchUI = this.scene.add.container(centerX, centerY);

    // Choose fire animation based on tier
    const tierAnimations = {
      common: "fire-common",
      uncommon: "fire-uncommon",
      rare: "fire-rare",
      epic: "fire-epic",
      legendary: "fire-legendary",
    };

    const fireKey = tierAnimations[fish.tier] || "fire-common";

    // Fire background
    const fireSprite = this.scene.add
      .sprite(0, 0, fireKey)
      .setOrigin(0.5, 0.5)
      .setScale(2);
    fireSprite.play(fireKey); // assumes you preloaded animations

    // Fish sprite
    const fishSprite = this.scene.add
      .sprite(0, 0, fish.spriteKey)
      .setScale(0.5);

    // Text for Fish Name
    const nameText = this.scene.add
      .text(0, -175, `${fish.name}`, {
        fontSize: "80px",
        color: "#fff",
        align: "center",
        stroke: "#000",
        strokeThickness: 11,
      })
      .setOrigin(0.5);

    // Text for length and reward
    const infoText = this.scene.add
      .text(
        0,
        150,
        `${fish.length.toFixed(1)} in         +${fish.reward} coins`,
        {
          fontSize: "50px",
          color: "#fff",
          align: "center",
          stroke: "#000",
          strokeThickness: 11,
        }
      )
      .setOrigin(0.5);

    this.catchUI.add([fireSprite, fishSprite, nameText, infoText]);

    // Fade out after animation duration
    this.scene.tweens.add({
      targets: this.catchUI,
      alpha: 0,
      duration: 1000, // fade out over 1 seconds
      delay: 4000, // wait 5 seconds before starting fade
      onComplete: () => {
        this.catchUI.destroy();
        this.catchUI = null;
      },
    });
  }
}
