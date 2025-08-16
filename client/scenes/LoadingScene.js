import Phaser from "phaser";

export default class LoadingScene extends Phaser.Scene {
  constructor() {
    super("LoadingScene");
    this.username = "Guest";
    this.uiReady = false;
    this.gameReady = false;
  }

  init(data) {
    this.username = data?.username || "Guest";
  }

  preload() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor(0x222222);

    // --- Preload loading sprite only ---
    this.load.spritesheet("loading", "./assets/ui/loading/loadingScreen.png", {
      frameWidth: 40,
      frameHeight: 18,
    });

    // Once loading sprite is ready, show animation & progress bar
    this.load.once("complete", () => {
      // --- Loading animation ---
      const loadingSprite = this.add.sprite(
        width / 2,
        height / 2 - 80,
        "loading"
      );
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

      // --- Progress bar ---
      const border = this.add.graphics();
      border.lineStyle(4, 0xffffff, 1);
      border.strokeRect(width / 2 - 200, height / 2 - 25, 400, 50);
      const progressBar = this.add.graphics();

      // Load the rest of the game assets
      this.loadGameAssets(progressBar, width, height);
    });

    this.load.start();
  }

  loadGameAssets(progressBar, width, height) {
    // Game assets
    this.load.image("tiles", "./assets/mapAssets/spritesheet.png");
    this.load.image("spenn", "./assets/Spen.png");
    this.load.image("dena", "./assets/Dena.png");
    this.load.tilemapTiledJSON("map1", "./assets/mapAssets/map1.json");

    // Progress bar
    this.load.on("progress", (value) => {
      progressBar.clear();
      progressBar.fillStyle(0x00ff00, 1);
      progressBar.fillRect(width / 2 - 196, height / 2 - 21, 392 * value, 42);
    });

    // When assets loaded, launch scenes
    this.load.on("complete", () => {
      // Launch scenes but keep loading scene visible
      this.scene.launch("scene-ui", { username: this.username });
      this.scene.launch("scene-game", { username: this.username });

      // Listen for 'create' event of each scene
      const uiScene = this.scene.get("scene-ui");
      const gameScene = this.scene.get("scene-game");

      uiScene.events.once("create", () => {
        this.uiReady = true;
        this.checkReady();
      });

      gameScene.events.once("create", () => {
        this.gameReady = true;
        this.checkReady();
      });
    });

    this.load.start();
  }

  checkReady() {
    // Stop loading scene only when both scenes are fully created
    if (this.uiReady && this.gameReady) {
      this.scene.stop();
    }
  }
}
