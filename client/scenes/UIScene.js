import Phaser from "phaser";
import sizes from "../config/gameConfig.js";
import CoinUI from "../ui/CoinUI.js";
import FishUI from "../ui/FishUI.js";
import FishMiniGameUI from "../ui/FishMiniGameUI.js";
import FishFactory from "../objects/fishing/FishFactory.js";
import GameBarUI from "../ui/GameBarUI.js";
import socket from "../network/socket.js";
import InventoryUI from "../ui/InventoryUI.js";
import ShopUI from "../ui/shopUI/ShopUI.js";
import ItemFactory from "../ui/shopUI/ItemFactory.js";

export default class UIScene extends Phaser.Scene {
  static instance = null;

  constructor() {
    super("scene-ui");
    this.coinUI = null;
    this.fishUI = null;
    this.fishMiniGameUI = null;
    this.gameBarUI = null;
    this.keyW = null;
    this.username = null;
    this.shopUI = null;
    this.inventoryUI = null;
  }

  preload() {
    GameBarUI.preload(this);
    CoinUI.preload(this);
    FishUI.preload(this);
    FishFactory.preloadAll(this);
    FishMiniGameUI.preload(this);

    ItemFactory.preloadAll(this);

    // InventoryUI.preload(this);
    ShopUI.preload(this);
  }

  create(data) {
    this.username = data?.username;
    UIScene.instance = this;

    // Fish UI
    FishUI.createAnimations(this);
    this.fishUI = new FishUI(this);
    this.fishMiniGameUI = new FishMiniGameUI(this);

    // Shop & Inventory UI
    this.shopUI = new ShopUI(this);

    // Player Stats UI
    const coinMargin = 100;
    this.coinUI = new CoinUI(this, coinMargin, coinMargin);
    // GameBar
    this.gameBarUI = new GameBarUI(this, sizes.width / 2, sizes.height - 50);
    this.gameBarUI.setUsername(this.username);

    socket.on("chatMessage", (data) => {
      if (UIScene.instance?.gameBarUI) {
        UIScene.instance.gameBarUI.addChatMessage(data);
      }
    });

    // Emit "ready" so LoadingScene knows UI is fully loaded
    this.events.emit("ready");
  }

  update() {}
}
