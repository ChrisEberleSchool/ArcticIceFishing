import Phaser from "phaser";
import Player from "../objects/Player/Player.js";
import RemotePlayer from "../objects/Player/RemotePlayer.js";
import sizes from "../config/gameConfig.js";
import CoinUI from "../ui/CoinUI.js";
import FishUI from "../ui/FishUI.js";
import FishMiniGameUI from "../ui/FishMiniGameUI.js";
import FishFactory from "../objects/Map/fishing/FishFactory.js";

export default class UIScene extends Phaser.Scene {
  static instance = null;

  constructor() {
    super("scene-ui");
    this.coinUI = null;
    this.fishUI = null;
    this.fishMiniGameUI = null;
  }

  preload() {
    this.load.image("coin", "./assets/ui/coin.png");
    FishUI.preload(this);
    FishFactory.preloadAll(this);
    FishMiniGameUI.preload(this);
  }

  create() {
    UIScene.instance = this;

    // Fish UI
    FishUI.createAnimations(this);
    this.fishUI = new FishUI(this);

    this.fishMiniGameUI = new FishMiniGameUI(this);

    // Player Stats UI
    const coinMargin = 100;
    this.coinUI = new CoinUI(this, coinMargin, coinMargin);
  }
}
