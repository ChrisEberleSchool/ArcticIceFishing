import Phaser from "phaser";

export default class FishMiniGameUI {
  constructor(scene) {
    this.scene = scene;
    this.minigameUI = null;
    this.hookSprite = null;
    this.fishSprite = null;
    this.lineHealthBar = null;

    this.barHeight = 800;
    this.barWidth = 100;
    this.hookY = 0;

    this.maxLineHealth = this.barHeight;
    this.currentLineHealth = 0;
  }

  static preload(scene) {
    scene.load.image("fishHook", "./assets/Game/Fishing/fishHook.png");
  }
  static createAnimations() {}

  showMiniGameUI() {
    const centerX = this.scene.cameras.main.centerX * 1.5;

    const centerY = this.scene.cameras.main.centerY;

    this.minigameUI = this.scene.add.container(centerX, centerY);

    const bg = this.scene.add
      .rectangle(0, 0, this.barWidth, this.barHeight, 0x333333)
      .setOrigin(0.5);

    this.lineHealthBar = this.scene.add
      .rectangle(this.barWidth, 0, this.barWidth / 2, this.barHeight, 0x8b0000)
      .setOrigin(0.5);

    this.hookSprite = this.scene.add.sprite(0, 0, "fishHook").setScale(0.2);

    this.minigameUI.add([bg, this.lineHealthBar, this.hookSprite]);
  }

  updateHookIndicator(y) {
    if (this.hookSprite) {
      this.hookSprite.y = y;
    }
  }

  updateLineHealth(amount) {
    this.currentLineHealth += amount;
    if (this.currentLineHealth > this.maxLineHealth) {
      this.currentLineHealth = this.maxLineHealth;
    }
    if (this.currentLineHealth < 0) {
      this.currentLineHealth = 0;
    }

    this.lineHealthBar.height = this.currentLineHealth;

    // Shift y so the bar grows upward from bottom, not down
    this.lineHealthBar.y = this.barHeight / 2 - this.currentLineHealth / 2;

    return this.currentLineHealth >= this.maxLineHealth;
  }

  resetLineHealth() {
    this.currentLineHealth = 0;
    if (this.lineHealthBar) {
      this.lineHealthBar.height = 0;
      this.lineHealthBar.y = this.barHeight / 2;
    }
  }

  destroy() {
    if (this.minigameUI) {
      this.minigameUI.destroy(true);
      this.minigameUI = null;
    }
  }
}
