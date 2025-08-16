import FishingSession from "../../fishing/FishingSession.js";
import UIScene from "../../../scenes/UIScene.js";

import PlayerState from "./PlayerState.js";
import PlayerNameTag from "./PlayerNameTag.js";
import PlayerSprite from "./PlayerSprite.js";
import PlayerFishingController from "./PlayerFishingController.js";
import PlayerData from "./PlayerData.js";

export default class Player {
  constructor(scene, x, y, username, socket, coins, fishCaught) {
    this.scene = scene;
    this.socket = socket;

    this.playerState = new PlayerState(username);
    this.playerData = new PlayerData(username, coins, fishCaught);
    this.playerSprite = new PlayerSprite(scene, x, y);
    this.playerNameTag = new PlayerNameTag(
      scene,
      this.playerSprite.sprite,
      username
    );

    this.fishingController = new PlayerFishingController(this, scene, socket);
    this.currentEquipment = "basicRod";
    this.fishingTimer = null;

    this.scene.cameras.main.startFollow(this.playerSprite.sprite);
    this.scene.cameras.main.zoom = 4.5;

    this.scene.events.on("playerStartedFishing", () => {
      if (UIScene.instance?.gameBarUI) {
        UIScene.instance.gameBarUI.showExitButton();
      }
    });
  }

  static preload(scene) {
    PlayerSprite.preload(scene);
    FishingSession.preload(scene);
  }

  static createAnimations(scene) {
    FishingSession.createAnimations(scene);
    PlayerSprite.createAnimations(scene);
  }

  update() {
    // --- Update name tag position ---
    this.playerNameTag.updatePosition(
      this.playerSprite.sprite.x,
      this.playerSprite.sprite.y
    );

    // --- Update fishing controller ---
    this.fishingController.update();

    const fishingState = this.fishingController.getFishingState();
    const isFishing = !!fishingState || this.playerState.fishing;

    // --- Stop movement if fishing ---
    if (isFishing) {
      this.stopMoving();
      this.updateAnimation();
      return;
    }

    // --- Movement logic ---
    const target = this.playerState.target;

    if (!target) {
      this.stopMoving();
      this.updateFacing();
      this.updateAnimation();
      return;
    }

    const { x: px, y: py } = this.playerSprite.sprite;
    const dist = Phaser.Math.Distance.Between(px, py, target.x, target.y);

    if (dist < this.playerState.distToTarget) {
      this.stopMoving();
    } else {
      const angle = Phaser.Math.Angle.Between(px, py, target.x, target.y);
      const vx = Math.cos(angle) * this.playerState.speed;
      const vy = Math.sin(angle) * this.playerState.speed;

      this.playerSprite.sprite.setVelocity(vx, vy);
      this.playerState.isMoving = true;
    }

    this.updateFacing();
    this.updateAnimation();
  }
  // ANIMATION RELATED METHODS
  updateFacing() {
    const velocity = this.playerSprite.sprite.body.velocity;

    if (Math.abs(velocity.x) > Math.abs(velocity.y)) {
      // Horizontal movement is dominant
      this.playerState.facing = velocity.x > 0 ? "right" : "left";
    } else if (Math.abs(velocity.y) > 0) {
      // Vertical movement is dominant
      this.playerState.facing = velocity.y > 0 ? "down" : "up";
    }
  }
  updateAnimation() {
    const fishingState = this.fishingController.getFishingState();
    if (fishingState) {
      switch (fishingState) {
        case "cast":
          return;
        case "idle":
          this.playerSprite.sprite.anims.play(`fishing-idle-right`, true);
          return;
        case "fight":
          this.playerSprite.sprite.anims.play(`fishing-fight-right`, true);
          return;
        case "caught":
          this.playerSprite.sprite.anims.play(`fishing-caught-right`, true);
          return;
      }
    }

    const velocity = this.playerSprite.sprite.body.velocity;
    if (velocity.length() === 0) {
      this.playerSprite.sprite.anims.play(
        `idle-${this.playerState.facing}`,
        true
      );
    } else {
      this.playerSprite.sprite.anims.play(
        `walk-${this.playerState.facing}`,
        true
      );
    }
  }

  addCoins(amount) {
    this.playerData.coins += amount;
    // Optionally clamp to 0 minimum:
    if (this.playerData.coins < 0) this.playerData.coins = 0;

    if (UIScene.instance && UIScene.instance.coinUI) {
      UIScene.instance.coinUI.updateCoinText(this.playerData.coins);
    } else {
      console.warn("CoinUI not ready yet.");
    }
  }

  moveTo(x, y) {
    this.playerState.target = { x, y };
  }
  stopMoving() {
    this.playerState.target = null;
    this.playerSprite.sprite.setVelocity(0, 0);
    this.playerState.isMoving = false;
  }

  // Getters and Setters

  get x() {
    return this.playerSprite.sprite.x;
  }

  get y() {
    return this.playerSprite.sprite.y;
  }

  destroy() {
    this.playerSprite.sprite.destroy();
    this.playerNameTag.destroy();
    this.playerState.destroy();
    this.playerData.destroy();
    this.playerSprite.destroy();
    this.playerNameTag.destroy();
  }
}
