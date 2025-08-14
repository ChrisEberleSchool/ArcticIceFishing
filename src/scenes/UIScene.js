import Phaser from "phaser";
import Player from "../objects/Player/Player.js";
import RemotePlayer from "../objects/Player/RemotePlayer.js";
import sizes from "../config/gameConfig.js";
import CoinUI from "../ui/CoinUI.js";
import FishUI from "../ui/FishUI.js";
import FishMiniGameUI from "../ui/FishMiniGameUI.js";
import FishFactory from "../objects/fishing/FishFactory.js";
import GameBarUI from "../ui/GameBarUI.js";
import socket from "../network/socket.js";

export default class UIScene extends Phaser.Scene {
  static instance = null;

  constructor() {
    super("scene-ui");
    this.coinUI = null;
    this.fishUI = null;
    this.fishMiniGameUI = null;
    this.gameBarUI = null;
  }

  preload() {
    GameBarUI.preload(this);
    CoinUI.preload(this);
    FishUI.preload(this);
    FishFactory.preloadAll(this);
    FishMiniGameUI.preload(this);
  }

  create(data) {
    UIScene.instance = this;

    // Fish UI
    FishUI.createAnimations(this);
    this.fishUI = new FishUI(this);

    this.fishMiniGameUI = new FishMiniGameUI(this);

    // Player Stats UI
    const coinMargin = 100;
    this.coinUI = new CoinUI(this, coinMargin, coinMargin);

    // GameBar
    this.gameBarUI = new GameBarUI(this, sizes.width / 2, sizes.height - 50);
    this.gameBarUI.setUsername(data?.username);

    socket.on("chatMessage", (data) => {
      if (UIScene.instance?.gameBarUI) {
        UIScene.instance.gameBarUI.addChatMessage(data);
      }
    });
  }
}
