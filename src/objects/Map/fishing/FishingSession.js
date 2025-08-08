export default class FishingSession {
  constructor(scene, player, fishingTile) {
    this.scene = scene;
    this.player = player;
    this.fishingTile = fishingTile;

    this.state = null;
    this.minigameUI = null;
    this.hookSprite = null;

    this.barHeight = 140;
    this.barWidth = 25;

    this.hookY = 0;
    this.fishSpeed = 0.5;
    this.pullSpeed = 1.5;
    this.catchAnimationDuration = 3000;

    this.player.fishing = true;

    this.isMouseDown = false;
    this.isTugging = false;
    this.fightActive = false;

    this.catchTimer = null;

    this.start();
  }

  static preload(scene) {
    scene.load.image("fishHook", "./assets/ui/fishHook.png");
  }

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

    if (this.minigameUI) this.minigameUI.destroy();

    const x = this.player.x + 50;
    const y = this.player.y - 60;
    this.minigameUI = this.scene.add.container(x, y);

    // Background bar
    const bg = this.scene.add
      .rectangle(0, 0, this.barWidth, this.barHeight, 0x333333)
      .setOrigin(0.5);

    // Hook sprite indicator
    this.hookSprite = this.scene.add.sprite(0, 0, "fishHook").setScale(0.05);
    this.hookY = 0;
    this.hookSprite.y = this.hookY;

    this.minigameUI.add([bg, this.hookSprite]);

    this.isMouseDown = false;
    this.isTugging = false;

    // NO input event registration here anymore!

    this.tugEvent = this.scene.time.addEvent({
      delay: Phaser.Math.Between(1000, 2000),
      loop: true,
      callback: () => {
        this.isTugging = true;
        this.scene.time.delayedCall(500, () => (this.isTugging = false));
      },
    });

    this.updateEvent = this.scene.time.addEvent({
      delay: 16,
      loop: true,
      callback: this.updateFight,
      callbackScope: this,
    });
  }

  updateFight() {
    if (!this.hookSprite || !this.player.fishing) return;
    const minY = -this.barHeight / 2 + 15;
    const maxY = this.barHeight / 2 - 15;

    if (this.isTugging) {
      this.hookY += this.fishSpeed * 2;
      this.hookSprite.setTint(0xff0000);
    } else {
      if (this.isMouseDown) this.hookY -= this.pullSpeed;
      this.hookSprite.clearTint();
    }

    if (this.hookY < minY) this.hookY = minY;
    if (this.hookY > maxY) this.hookY = maxY;

    this.hookSprite.y = this.hookY;

    if (this.hookY <= minY) {
      this.endFight(true);
    } else if (this.hookY >= maxY) {
      this.endFight(false);
    }
  }

  endFight(won) {
    this.clearTimers();

    if (this.hookSprite) {
      this.hookSprite.destroy();
      this.hookSprite = null;
    }
    this.fightActive = false;

    if (this.minigameUI) {
      this.minigameUI.destroy();
      this.minigameUI = null;
    }

    if (won) {
      this.player.addCoins(100);
      console.log("You caught the fish!");
      this.player.fishingState = "caught";
      this.player.updateAnimation();

      this.catchTimer = this.scene.time.delayedCall(
        this.catchAnimationDuration,
        () => {
          this.catchTimer = null; // clear ref on completion
          if (this.player.fishing) this.waitForBite();
        }
      );
    } else {
      console.log("You lost the fish!");
      this.player.fishingState = "idle";
      this.player.updateAnimation();
      this.waitForBite();
    }
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

    if (this.minigameUI) {
      this.minigameUI.destroy();
      this.minigameUI = null;
    }

    this.player.fishing = false;
    this.player.fishingState = null;
    this.fightActive = false;
  }
}
