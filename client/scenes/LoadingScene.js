import Phaser from "phaser";
import GameBarUI from "../ui/GameBarUI";
import CoinUI from "../ui/CoinUI";
import FishUI from "../ui/FishUI";
import FishFactory from "../objects/fishing/FishFactory";
import FishMiniGameUI from "../ui/FishMiniGameUI";
import ItemFactory from "../ui/shopUI/ItemFactory";
import ShopUI from "../ui/shopUI/ShopUI";
import Player from "../objects/Player/local/Player";

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

    // --- Create loading animation sprite (reusing loaded assets) ---
    const loadingSprite = this.add.sprite(
      width / 2,
      height / 2 - 80,
      "loading"
    );

    // Play the animation assuming it was created in BootScene
    loadingSprite.play("loadingAnim");

    // --- Progress bar setup ---
    const border = this.add.graphics();
    border.lineStyle(4, 0xffffff, 1);
    border.strokeRect(width / 2 - 200, height / 2 - 25, 400, 50);

    this.progressBar = this.add.graphics();

    // Listen for progress and update progress bar
    this.load.on("progress", (value) => {
      this.progressBar.clear();
      this.progressBar.fillStyle(0x00ff00, 1);
      this.progressBar.fillRect(
        width / 2 - 196,
        height / 2 - 21,
        392 * value,
        42
      );
    });

    // When loading is complete
    this.load.once("complete", () => {
      this.scene.launch("scene-ui", { username: this.username });
      this.scene.launch("scene-game", { username: this.username });

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

    // Add all other assets to load now
    Player.preload(this);
    GameBarUI.preload(this);
    CoinUI.preload(this);
    FishUI.preload(this);
    FishFactory.preloadAll(this);
    FishMiniGameUI.preload(this);
    ItemFactory.preloadAll(this);
    ShopUI.preload(this);

    this.load.image("tiles", "./assets/mapAssets/spritesheet.png");
    this.load.tilemapTiledJSON("map1", "./assets/mapAssets/map1.json");

    // Start loading the game assets (don't load loading sprite again!)
    this.load.start();
  }

  checkReady() {
    if (this.uiReady && this.gameReady) {
      this.scene.stop();
    }
  }
}
