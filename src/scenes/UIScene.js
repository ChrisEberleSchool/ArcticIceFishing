import Phaser from "phaser";
import Player from "../objects/Player/Player.js";
import RemotePlayer from "../objects/Player/RemotePlayer.js";
import sizes from "../config/gameConfig.js";
import CoinUI from "../ui/CoinUI.js";
import FishUI from "../ui/FishUI.js";
import FishFactory from "../objects/Map/fishing/FishFactory.js";

export default class UIScene extends Phaser.Scene {
  static instance = null;

  constructor() {
    super("scene-ui");
    this.coinUI = null;
    this.FishUI = null;
  }

  preload() {
    this.load.image("coin", "./assets/ui/coin.png");
    FishUI.preload(this);
    FishFactory.preloadAll(this);
  }

  create() {
    UIScene.instance = this;

    // Call createAnimations so fire anims are created
    FishUI.createAnimations(this);
    // Create fishUI instance at top-right or wherever you want
    this.fishUI = new FishUI(this, 400, 100); // example coordinates\

    const coinMargin = 100;
    this.coinUI = new CoinUI(this, coinMargin, coinMargin);
  }
}
