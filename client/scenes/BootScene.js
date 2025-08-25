import Phaser from "phaser";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    // Set background to avoid black screen
    this.cameras.main.setBackgroundColor("#1a1a1a");

    // Minimal loading sprite/animation
    this.load.spritesheet("loading", "./assets/ui/loading/loadingScreen.png", {
      frameWidth: 40,
      frameHeight: 18,
    });
  }

  create() {
    const { width, height } = this.scale;

    // Show loading animation while AuthScene preloads
    const loadingSprite = this.add.sprite(width / 2, height / 2, "loading");
    this.anims.create({
      key: "loadingAnim",
      frames: this.anims.generateFrameNumbers("loading", {
        start: 0,
        end: 5,
      }),
      frameRate: 8,
      repeat: -1,
    });
    loadingSprite.play("loadingAnim");

    // Add slight delay to ensure animation is visible
    this.time.delayedCall(300, () => {
      this.scene.start("AuthScene");
    });
  }
}
