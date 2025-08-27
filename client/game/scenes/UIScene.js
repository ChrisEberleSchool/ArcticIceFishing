import Phaser from "phaser";
import sizes from "../Config/gameConfig.js";
import CoinUI from "../ui/Hud/CoinUI.js";
import FishUI from "../system/Fishing/ui/FishUI.js";
import FishMiniGameUI from "../system/Fishing/ui/FishMiniGameUI.js";
import FishFactory from "../system/Fishing/FishFactory.js";
import GameBarUI from "../ui/Hud/GameBarUI.js";
import socket from "../../network/socket.js";
import InventoryUI from "../system/Player/Local/ui/InventoryUI.js";
import ShopUI from "../ui/shopUI/ShopUI.js";
import ItemFactory from "../system/item/ItemFactory.js";

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

  preload() {}

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
