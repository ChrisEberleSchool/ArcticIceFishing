import Phaser from "phaser";

export default class LoadingScene extends Phaser.Scene {
  constructor() {
    super("LoadingScene");
  }

  preload() {
    const { width, height } = this.scale;

    // Background
    this.cameras.main.setBackgroundColor(0x222222);

    // Create border bar
    const border = this.add.graphics();
    border.lineStyle(4, 0xffffff, 1);
    border.strokeRect(width / 2 - 200, height / 2 - 25, 400, 50);

    // Create progress fill bar
    const progressBar = this.add.graphics();

    this.load.on("progress", (value) => {
      progressBar.clear();
      progressBar.fillStyle(0x00ff00, 1);
      progressBar.fillRect(width / 2 - 196, height / 2 - 21, 392 * value, 42);
    });

    this.load.on("complete", () => {
      console.log("All assets loaded!");
      this.startGame();
    });

    // Example: preload actual game assets
    this.load.image("tiles", "./assets/mapAssets/spritesheet.png");
    this.load.image("spenn", "./assets/Spen.png"); // load your PNG file
    this.load.image("dena", "./assets/Dena.png"); // load your PNG file
    this.load.tilemapTiledJSON("map1", "./assets/mapAssets/map1.json");

    // TODO: Load other assets for your GameScene/UI
  }

  create(data) {
    this.username = data?.username;

    this.startGame();
  }

  startGame() {
    if (!this.username) {
      console.error("Missing username for GameScene!");
      return;
    }

    this.scene.start("scene-game", { username: this.username });

    // Launch UI scene
    if (!this.scene.isActive("scene-ui")) {
      this.scene.launch("scene-ui", { username: this.username });
    }
    this.scene.bringToTop("scene-ui");
  }
}
