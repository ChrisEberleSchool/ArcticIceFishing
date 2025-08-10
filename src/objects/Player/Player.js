import FishingTileEvents from "../Map/FishingTileEvents";
import FishingSession from "../Map/fishing/FishingSession.js";
import UIScene from "../../scenes/UIScene.js";

//locomotion
const ANIM_IDLE_FRAMERATE = 4;
const ANIM_WALK_FRAMERATE = 12;
const ANIM_RUN_FRAMERATE = 14;
// fishing
const ANIM_FISHING_IDLE_FRAMERATE = 2;
const ANIM_FISHING_FIGHT_FRAMERATE = 6;

export default class Player {
  constructor(scene, x, y, username, socket, coins, fishCaught) {
    this.scene = scene;
    this.username = username;
    this.socket = socket;
    this.coins = coins;
    this.fishCaught = fishCaught;
    this.target = null;
    this.speed = 130;
    this.fishing = false;
    this.NameTagOffset = 24;
    this.distToTarget = 3;
    this.facing = "down";
    this.isMoving = false;

    this.currentEquipment = "basicRod";
    this.fishingSession = null;
    this.fishingTimer = null;
    this.fishingState = null; // "cast", "idle", "fight"
    this.currentFishingTile = null;
    this.fishingTileEvents = new FishingTileEvents(
      scene,
      socket,
      scene.worldGrid,
      this
    );

    this.fKey = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.F
    );

    this.socket.emit("requestFishingHoleStates");

    // ANIMATION PRELOADING

    this.sprite = scene.physics.add
      .sprite(x, y, "playerIdleSheet")
      .setOrigin(0.5)
      .setScale(0.8);
    this.sprite.play("idle-down");

    this.nameText = scene.add
      .text(x, y - 24, username.toUpperCase(), {
        fontSize: "10px",
        color: "#00ffff", // neon cyan-ish
        fontFamily: "'Orbitron', monospace", // sci-fi style font
        stroke: "#003344",
        strokeThickness: 2,
        letterSpacing: 1.5,
      })
      .setOrigin(0.5);

    this.scene.cameras.main.startFollow(this.sprite);
    this.scene.cameras.main.zoom = 4.5;

    this.interactText = this.scene.add
      .text(
        this.sprite.x,
        this.sprite.y + this.NameTagOffset,
        "Press F to Start Fishing!",
        {
          fontSize: "8px",
          color: "#00ffff", // neon cyan-ish
          fontFamily: "'Orbitron', monospace", // sci-fi style font
          stroke: "#003344",
          strokeThickness: 2,
          letterSpacing: 1,
        }
      )
      .setOrigin(0.5);
    this.interactText.setVisible(false);
  }

  createNameText(scene) {
    this.nameText = scene.add
      .text(x, y - 24, username.toUpperCase(), {
        fontSize: "10px",
        color: "#00ffff", // neon cyan-ish
        fontFamily: "'Orbitron', monospace", // sci-fi style font
        stroke: "#003344",
        strokeThickness: 2,
        letterSpacing: 1.5,
      })
      .setOrigin(0.5);
  }

  static preload(scene) {
    scene.load.spritesheet(
      "playerIdleSheet",
      "./assets/basePlayer/playerSprites/standard/idle.png",
      {
        frameWidth: 64,
        frameHeight: 64,
      }
    );

    scene.load.spritesheet(
      "playerWalkSheet",
      "./assets/basePlayer/playerSprites/standard/walk.png",
      {
        frameWidth: 64,
        frameHeight: 64,
      }
    );

    scene.load.spritesheet(
      "playerFishingSheet",
      "./assets/basePlayer/playerSprites/custom/tool_rod.png",
      {
        frameWidth: 128,
        frameHeight: 128,
      }
    );

    FishingSession.preload(scene);
  }

  static createAnimations(scene) {
    // Create Animations
    FishingSession.createAnimations(scene);
    // IDLE ANIMS
    scene.anims.create({
      key: "idle-up",
      frames: scene.anims.generateFrameNumbers("playerIdleSheet", {
        frames: [0, 1],
      }),
      frameRate: ANIM_IDLE_FRAMERATE,
      repeat: -1,
    });

    scene.anims.create({
      key: "idle-left",
      frames: scene.anims.generateFrameNumbers("playerIdleSheet", {
        frames: [2, 3],
      }),
      frameRate: ANIM_IDLE_FRAMERATE,
      repeat: -1,
    });

    scene.anims.create({
      key: "idle-down",
      frames: scene.anims.generateFrameNumbers("playerIdleSheet", {
        frames: [4, 5],
      }),
      frameRate: ANIM_IDLE_FRAMERATE,
      repeat: -1,
    });

    scene.anims.create({
      key: "idle-right",
      frames: scene.anims.generateFrameNumbers("playerIdleSheet", {
        frames: [6, 7],
      }),
      frameRate: ANIM_IDLE_FRAMERATE,
      repeat: -1,
    });
    // WALK ANIMS
    scene.anims.create({
      key: "walk-up",
      frames: scene.anims.generateFrameNumbers("playerWalkSheet", {
        frames: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      }),
      frameRate: ANIM_WALK_FRAMERATE,
      repeat: -1,
    });

    scene.anims.create({
      key: "walk-left",
      frames: scene.anims.generateFrameNumbers("playerWalkSheet", {
        frames: [9, 10, 11, 12, 13, 14, 15, 16, 17],
      }),
      frameRate: ANIM_WALK_FRAMERATE,
      repeat: -1,
    });

    scene.anims.create({
      key: "walk-down",
      frames: scene.anims.generateFrameNumbers("playerWalkSheet", {
        frames: [18, 19, 20, 21, 22, 23, 24, 25, 26],
      }),
      frameRate: ANIM_WALK_FRAMERATE,
      repeat: -1,
    });

    scene.anims.create({
      key: "walk-right",
      frames: scene.anims.generateFrameNumbers("playerWalkSheet", {
        frames: [27, 28, 29, 30, 31, 32, 33, 34, 35],
      }),
      frameRate: ANIM_WALK_FRAMERATE,
      repeat: -1,
    });

    // FISH CAST ANIM
    scene.anims.create({
      key: "fishing-cast-right",
      frames: scene.anims.generateFrameNumbers("playerFishingSheet", {
        frames: [42, 43, 44, 45],
      }),
      frameRate: ANIM_FISHING_FIGHT_FRAMERATE,
      repeat: 0,
    });
    // FISHING IDLE ANIM
    scene.anims.create({
      key: "fishing-idle-right",
      frames: scene.anims.generateFrameNumbers("playerFishingSheet", {
        frames: [45, 46],
      }),
      frameRate: ANIM_FISHING_IDLE_FRAMERATE,
      repeat: -1,
    });
    // FISH FIGHT ANIM
    scene.anims.create({
      key: "fishing-fight-right",
      frames: scene.anims.generateFrameNumbers("playerFishingSheet", {
        frames: [46, 47, 48],
      }),
      frameRate: ANIM_FISHING_FIGHT_FRAMERATE,
      repeat: -1,
    });

    scene.anims.create({
      key: "fishing-caught-right",
      frames: scene.anims.generateFrameNumbers("playerFishingSheet", {
        frames: [50, 51],
      }),
      frameRate: ANIM_FISHING_FIGHT_FRAMERATE,
      repeat: -1,
    });
  }

  setPosition(x, y) {
    this.sprite.setPosition(x, y);
  }

  moveTo(x, y) {
    this.target = { x, y };
  }
  stopMoving() {
    this.target = null;
    this.sprite.setVelocity(0, 0);
  }

  update() {
    // initial setting of position
    this.nameText.x = this.sprite.x;
    this.nameText.y = this.sprite.y - this.NameTagOffset;

    const { x: gridX, y: gridY } = this.scene.worldGrid.WorldCoordinatesToGrid(
      this.x,
      this.y
    );
    const fishingTile = this.scene.worldGrid.getFishingTileAt(gridX, gridY);

    if (fishingTile && !this.fishing) {
      this.stopFishing();
      if (fishingTile.isOccupied) {
        this.interactText.setText("Hole is Occupied");
      } else {
        this.interactText.setText("Press F to Start Fishing!");
      }
      this.interactText.setVisible(true);
      this.interactText.x = this.sprite.x;
      this.interactText.y = this.sprite.y + this.NameTagOffset;
    } else {
      this.interactText.setVisible(false);
    }

    if (Phaser.Input.Keyboard.JustDown(this.fKey)) {
      if (this.fishing) {
        this.stopFishing();
      } else {
        if (this.scene.worldGrid.isOnFishingTile(this.x, this.y)) {
          this.fishingTileEvents.tryOccupyFishingTile(this.x, this.y);
        }
      }
    }

    // if already fishing return
    if (this.fishing) {
      // Already fishing, do nothing
      this.stopMoving();
      this.isMoving = false;
      this.updateAnimation();
      return;
    }

    if (!this.target) {
      this.sprite.setVelocity(0, 0);
      this.isMoving = false;
      this.updateFacing();
      this.updateAnimation();
      return;
    }

    const dist = Phaser.Math.Distance.Between(
      this.sprite.x,
      this.sprite.y,
      this.target.x,
      this.target.y
    );

    if (dist < this.distToTarget) {
      this.sprite.setVelocity(0, 0);
      this.target = null;
      this.isMoving = false;
    } else {
      const angle = Phaser.Math.Angle.Between(
        this.sprite.x,
        this.sprite.y,
        this.target.x,
        this.target.y
      );
      const vx = Math.cos(angle) * this.speed;
      const vy = Math.sin(angle) * this.speed;
      this.sprite.setVelocity(vx, vy);
      this.isMoving = true;
    }

    this.updateFacing();
    this.updateAnimation();
  }

  destroy() {
    this.sprite.destroy();
    this.nameText.destroy();
  }

  startFishing(fishingTile) {
    if (!fishingTile) return;

    // Stop any existing fishing session to avoid doubling timers
    if (this.fishingSession) {
      this.fishingSession.stop();
      this.fishingSession = null;
    }

    const xOffset = -18;
    const yOffset = -18;

    const { x, y } = this.scene.worldGrid.GridCoordinatesToWorld(
      fishingTile.GridPos.x,
      fishingTile.GridPos.y
    );

    this.sprite.x = x + xOffset;
    this.sprite.y = y + yOffset;

    this.nameText.x = this.sprite.x;
    this.nameText.y = this.sprite.y - this.NameTagOffset;

    this.stopMoving();

    this.facing = "right";
    this.fishing = true;
    this.currentFishingTile = fishingTile;

    // Create and start a new FishingSession
    this.fishingSession = new FishingSession(this.scene, this, fishingTile);
  }

  stopFishing() {
    if (!this.fishing) return;

    // Clear fishing session and its timers to prevent doubling
    if (this.fishingSession) {
      this.fishingSession.stop();
      this.fishingSession = null;
    }

    if (this.currentFishingTile) {
      this.fishingTileEvents.releaseFishingTile();
      this.currentFishingTile = null;
    }

    this.fishing = false;
    this.fishingState = null;
    this.target = null;
    this.sprite.setVelocity(0, 0);

    this.updateAnimation();
  }
  // ANIMATION RELATED METHODS
  updateFacing() {
    const velocity = this.sprite.body.velocity;

    if (Math.abs(velocity.x) > Math.abs(velocity.y)) {
      // Horizontal movement is dominant
      this.facing = velocity.x > 0 ? "right" : "left";
    } else if (Math.abs(velocity.y) > 0) {
      // Vertical movement is dominant
      this.facing = velocity.y > 0 ? "down" : "up";
    }
  }
  updateAnimation() {
    if (this.fishing) {
      if (this.fishingState === "cast") {
        // Do nothing: let casting animation play out
        return;
      } else if (this.fishingState === "idle") {
        this.sprite.anims.play(`fishing-idle-right`, true);
        return;
      } else if (this.fishingState === "fight") {
        this.sprite.anims.play(`fishing-fight-right`, true);
        return;
      } else if (this.fishingState === "caught") {
        this.sprite.anims.play(`fishing-caught-right`, true);
        return;
      }
    }

    const velocity = this.sprite.body.velocity;

    if (velocity.length() === 0) {
      this.sprite.anims.play(`idle-${this.facing}`, true);
    } else {
      this.sprite.anims.play(`walk-${this.facing}`, true);
    }
  }

  addCoins(amount) {
    this.coins += amount;
    // Optionally clamp to 0 minimum:
    if (this.coins < 0) this.coins = 0;

    if (UIScene.instance && UIScene.instance.coinUI) {
      UIScene.instance.coinUI.updateCoinText(this.coins);
    } else {
      console.warn("CoinUI not ready yet.");
    }
  }

  // Getters and Setters

  // grabs the world coordinates of the player
  get x() {
    return this.sprite.x;
  }

  get y() {
    return this.sprite.y;
  }
}
