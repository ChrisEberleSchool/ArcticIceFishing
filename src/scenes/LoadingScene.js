import Phaser from "phaser";

export default class LoadingScene extends Phaser.Scene {
  constructor() {
    super("LoadingScene");
    this.username = "Guest";
  }

  init(data) {
    this.username = data?.username || "Guest";
  }

  preload() {
    const { width, height } = this.scale;

    // Background & progress bar
    this.cameras.main.setBackgroundColor(0x222222);
    const border = this.add.graphics();
    border.lineStyle(4, 0xffffff, 1);
    border.strokeRect(width / 2 - 200, height / 2 - 25, 400, 50);
    const progressBar = this.add.graphics();

    // LoadingScene assets
    this.load.spritesheet("loading", "./assets/ui/loading/loadingScreen.png", {
      frameWidth: 40,
      frameHeight: 18,
    });

    // Game assets
    this.load.image("tiles", "./assets/mapAssets/spritesheet.png");
    this.load.image("spenn", "./assets/Spen.png");
    this.load.image("dena", "./assets/Dena.png");
    this.load.tilemapTiledJSON("map1", "./assets/mapAssets/map1.json");

    // Optional progress bar
    this.load.on("progress", (value) => {
      progressBar.clear();
      progressBar.fillStyle(0x00ff00, 1);
      progressBar.fillRect(width / 2 - 196, height / 2 - 21, 392 * value, 42);
    });
  }

  create() {
    // Launch UIScene first
    this.scene.launch("scene-ui", { username: this.username });

    const uiScene = this.scene.get("scene-ui");

    // Wait for UIScene to finish creating coinUI before starting GameScene
    this.time.addEvent({
      delay: 50,
      loop: true,
      callback: () => {
        if (uiScene?.gameBarUI) {
          // UIScene ready → launch GameScene once
          this.scene.launch("scene-game", { username: this.username });
          this.scene.stop(); // Stop LoadingScene
          this.time.removeAllEvents(); // Stop this loop
        }
      },
    });
  }
}
