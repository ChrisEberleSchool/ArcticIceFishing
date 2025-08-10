// src/ui/CoinUI.js
import Phaser from "phaser";

export default class CoinUI {
  constructor(scene, x, y) {
    this.scene = scene;
    this.container = scene.add.container(x, y);
    this.container.setScrollFactor(0); // lock UI to camera

    const coinIcon = scene.add
      .image(0, 0, "coin")
      .setOrigin(0.5, 0.5)
      .setScale(0.25);

    this.coinText = scene.add
      .text(100, 0, "0", {
        fontSize: "80px",
        fontFamily: "Arial",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 14,
        letterSpacing: 12,
      })
      .setOrigin(0, 0.5);

    this.container.add([coinIcon, this.coinText]);
  }

  updateCoinText(amount) {
    this.coinText.setText(amount.toString());
  }
}
