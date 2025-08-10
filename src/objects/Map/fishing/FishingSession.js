import FishFactory from "./FishFactory.js";
import UIScene from "../../../scenes/UIScene.js";
import FishMiniGameUI from "../../../ui/FishMiniGameUI.js";

export default class FishingSession {
  constructor(scene, player, fishingTile) {
    this.scene = scene;
    this.player = player;
    this.fishingTile = fishingTile;
    this.currentFish = null;

    this.player.fishing = true;
    this.state = null;
    this.isMouseDown = false;
    this.isTugging = false;
    this.fightActive = false;

    this.hookY = 0;
    this.pullSpeed = 6;
    this.catchAnimationDuration = 3000;
    this.catchTimer = null;

    this.start();
  }

  static preload(scene) {}

  static createAnimations(scene) {}

  start() {
    this.state = "cast";
    this.player.fishingState = "cast";
    this.player.updateAnimation();

    this.player.sprite.anims.play("fishing-cast-right");

    this.player.sprite.once("animationcomplete-fishing-cast-right", () => {
      this.state = "idle";
      this.player.fishingState = "idle";
      this.player.updateAnimation();
      this.waitForBite();
    });
  }

  handlePointerDown(pointer) {
    this.isMouseDown = true;
  }

  handlePointerUp(pointer) {
    this.isMouseDown = false;
  }

  waitForBite() {
    if (this.fightActive) return;
    this.clearTimers();

    console.log("Waiting for bite...");
    this.player.fishingState = "idle";
    this.player.updateAnimation();

    this.biteTimer = this.scene.time.delayedCall(
      Phaser.Math.Between(3000, 7000),
      () => {
        console.log(
          "Bite timer triggered. Player fishing?",
          this.player.fishing
        );
        if (!this.player.fishing || this.fightActive) return;
        this.startFight();
      }
    );
  }

  startFight() {
    if (this.fightActive) return;
    this.fightActive = true;

    this.state = "fight";
    this.player.fishingState = "fight";
    this.player.updateAnimation();

    // Get fish based on player's current equipment
    this.currentFish = FishFactory.getRandomFish(this.player.currentEquipment);
    if (!this.currentFish) {
      console.warn("No fish available for current equipment. Ending fight.");
      this.endFight(false);
      return;
    }

    // Ensure fishMiniGameUI exists
    if (UIScene.instance) {
      if (!UIScene.instance.fishMiniGameUI) {
        UIScene.instance.fishMiniGameUI = new FishMiniGameUI(UIScene.instance);
      }
      UIScene.instance.fishMiniGameUI.showMiniGameUI();
      this.hookY = 0; // reset hook position
      UIScene.instance.fishMiniGameUI.updateHookIndicator(this.hookY);
      UIScene.instance.fishMiniGameUI.resetLineHealth();
    }

    this.isMouseDown = false;
    this.isTugging = false;

    // Tug Event Setup

    const [minTugDuration, maxTugDuration] = this.currentFish.tugDurationRange;
    const [minTugCooldown, maxTugCooldown] = this.currentFish.tugCooldownRange;

    const tugCallback = () => {
      this.isTugging = true;
      this.scene.time.delayedCall(
        Phaser.Math.Between(minTugDuration, maxTugDuration),
        () => (this.isTugging = false)
      );
    };

    // Fire first tug immediately
    tugCallback();

    // Then schedule repeated tugs with randomized delay
    this.tugEvent = this.scene.time.addEvent({
      delay: Phaser.Math.Between(minTugCooldown, maxTugCooldown),
      loop: true,
      callback: tugCallback,
    });

    this.updateEvent = this.scene.time.addEvent({
      delay: 16,
      loop: true,
      callback: this.updateFight,
      callbackScope: this,
    });
  }

  updateFight() {
    if (
      !UIScene.instance ||
      !UIScene.instance.fishMiniGameUI ||
      !this.currentFish
    )
      return;

    const ui = UIScene.instance.fishMiniGameUI;
    const minY = -ui.barHeight / 2 + 50;
    const maxY = ui.barHeight / 2 - 50;

    if (this.isTugging) {
      this.hookY += this.currentFish.fishSpeed;
      ui.hookSprite.setTint(0xff0000);

      // Reduce line health when tugging and player reels (holding mouse down)
      if (this.isMouseDown) {
        // Adjust the amount reduced per frame to your liking
        const lineBroken = ui.updateLineHealth(3);

        if (lineBroken) {
          this.endFight(false); // line broke -> lose fight
          return;
        }
      }
    } else {
      if (this.isMouseDown) this.hookY -= this.pullSpeed;
      ui.hookSprite.clearTint();

      // Optionally recover line health slowly if not tugging
      ui.updateLineHealth(-1);
    }

    if (this.hookY < minY) this.hookY = minY;
    if (this.hookY > maxY) this.hookY = maxY;

    ui.updateHookIndicator(this.hookY);

    if (this.hookY <= minY) {
      this.endFight(true);
    } else if (this.hookY >= maxY) {
      this.endFight(false);
    }
  }

  endFight(won) {
    this.clearTimers();
    this.fightActive = false;

    if (UIScene.instance && UIScene.instance.fishMiniGameUI) {
      UIScene.instance.fishMiniGameUI.destroy();
      UIScene.instance.fishMiniGameUI = null;
    }

    if (won) {
      this.player.addCoins(this.currentFish.reward);
      console.log(
        `You caught a ${this.currentFish.tier} ${this.currentFish.name} and earned ${this.currentFish.reward} coins!`
      );

      this.player.fishingState = "caught";
      this.player.updateAnimation();

      if (UIScene.instance && UIScene.instance.fishUI) {
        UIScene.instance.fishUI.showCatchUI(this.currentFish);
      }

      this.catchTimer = this.scene.time.delayedCall(
        this.catchAnimationDuration,
        () => {
          this.catchTimer = null;
          if (this.player.fishing) this.waitForBite();
        }
      );
    } else {
      console.log(
        `You Lost a ${this.currentFish.tier} ${this.currentFish.name}`
      );

      this.player.fishingState = "idle";
      this.player.updateAnimation();
      this.waitForBite();
    }

    this.currentFish = null;
  }

  clearTimers() {
    if (this.updateEvent) {
      this.updateEvent.remove(false);
      this.updateEvent = null;
    }
    if (this.tugEvent) {
      this.tugEvent.remove(false);
      this.tugEvent = null;
    }
    if (this.biteTimer) {
      this.biteTimer.remove(false);
      this.biteTimer = null;
    }
    if (this.catchTimer) {
      this.catchTimer.remove(false);
      this.catchTimer = null;
    }
  }

  stop() {
    this.clearTimers();

    // NO input event off here

    if (UIScene.instance && UIScene.instance.fishMiniGameUI) {
      UIScene.instance.fishMiniGameUI.destroy();
      UIScene.instance.fishMiniGameUI = null;
    }

    this.player.fishing = false;
    this.player.fishingState = null;
    this.fightActive = false;
  }
}
