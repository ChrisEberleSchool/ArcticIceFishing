import Phaser from "phaser";

export default class LoadingScene extends Phaser.Scene {
  constructor() {
    super("LoadingScene");
    this.loadingSprite = null;
    this.username = "Guest";
  }

  init(data) {
    // Init runs before preload, so we set username here
    this.username = data?.username || "Guest";
  }

  preload() {
    const { width, height } = this.scale;

    // Background + progress bar
    this.cameras.main.setBackgroundColor(0x222222);
    const border = this.add.graphics();
    border.lineStyle(4, 0xffffff, 1);
    border.strokeRect(width / 2 - 200, height / 2 - 25, 400, 50);
    const progressBar = this.add.graphics();

    // Load loading animation first
    this.load.spritesheet("loading", "./assets/ui/loading/loadingScreen.png", {
      frameWidth: 40,
      frameHeight: 18,
    });

    // Once the loading sprite is ready, start animating
    this.load.once("filecomplete-spritesheet-loading", () => {
      this.anims.create({
        key: "loading",
        frames: this.anims.generateFrameNumbers("loading", {
          start: 0,
          end: 5,
        }),
        frameRate: 8,
        repeat: -1,
      });
      this.loadingSprite = this.add.sprite(
        width / 2,
        height / 2 + 100,
        "loading"
      );
      this.loadingSprite.play("loading");
    });

    // Progress bar updates
    this.load.on("progress", (value) => {
      progressBar.clear();
      progressBar.fillStyle(0x00ff00, 1);
      progressBar.fillRect(width / 2 - 196, height / 2 - 21, 392 * value, 42);
    });

    this.load.on("complete", () => {
      console.log("All assets loaded!");
      this.startGame();
    });

    // Heavy assets
    this.load.image("tiles", "./assets/mapAssets/spritesheet.png");
    this.load.image("spenn", "./assets/Spen.png");
    this.load.image("dena", "./assets/Dena.png");
    this.load.tilemapTiledJSON("map1", "./assets/mapAssets/map1.json");
  }

  startGame() {
    // Destroy loading sprite before leaving
    if (this.loadingSprite) {
      this.loadingSprite.destroy();
    }

    // Switch to the game
    this.scene.start("scene-game", { username: this.username });

    if (!this.scene.isActive("scene-ui")) {
      this.scene.launch("scene-ui", { username: this.username });
    }
    this.scene.bringToTop("scene-ui");
  }
}
