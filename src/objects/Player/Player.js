import FishingTileEvents from "../Map/FishingTileEvents";

export default class Player {
  constructor(scene, x, y, username, socket) {
    this.scene = scene;
    this.username = username;
    this.socket = socket;
    this.target = null;
    this.speed = 150;
    this.fishing = false;
    this.NameTagOffset = 24;
    this.distToTarget = 3;

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

    // Create sprite and name
    this.sprite = scene.physics.add
      .sprite(x, y, "playerIdleSheet")
      .setOrigin(0.5)
      .setScale(2);
    this.sprite.play("idle");

    this.nameText = scene.add
      .text(x, y - this.NameTagOffset, username, {
        fontSize: "12px",
        color: "#ffffff",
        fontFamily: "Arial",
        stroke: "#000",
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    this.scene.cameras.main.startFollow(this.sprite);
    this.scene.cameras.main.zoom = 2.5;

    this.interactText = this.scene.add
      .text(
        this.sprite.x,
        this.sprite.y + this.NameTagOffset,
        "Press F to Start Fishing!",
        {
          fontSize: "12px",
          color: "#ffffff",
          fontFamily: "Arial",
          stroke: "#000",
          strokeThickness: 3,
        }
      )
      .setOrigin(0.5);
    this.interactText.setVisible(false);
  }

  static preload(scene) {
    scene.load.spritesheet(
      "playerIdleSheet",
      "./assets/basePlayer/16x16IdleSheet.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      }
    );
  }

  static createAnimations(scene) {
    scene.anims.create({
      key: "idle",
      frames: scene.anims.generateFrameNumbers("playerIdleSheet", {
        frames: [0, 1],
      }),
      frameRate: 4,
      repeat: -1,
    });
  }

  moveTo(x, y) {
    this.target = { x, y };
  }
  stopMoving() {
    this.target = null;
    this.sprite.setVelocity(0, 0);
  }

  update() {
    const { x: gridX, y: gridY } = this.scene.worldGrid.WorldCoordinatesToGrid(
      this.x,
      this.y
    );
    const fishingTile = this.scene.worldGrid.getFishingTileAt(gridX, gridY);

    if (fishingTile && !this.fishing) {
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
      return;
    }

    if (!this.target) {
      this.sprite.setVelocity(0, 0);
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
    }

    this.nameText.x = this.sprite.x;
    this.nameText.y = this.sprite.y - this.NameTagOffset;
  }

  destroy() {
    this.sprite.destroy();
    this.nameText.destroy();
  }

  stopFishing() {
    if (this.fishing && this.currentFishingTile) {
      this.fishingTileEvents.releaseFishingTile();
      this.fishing = false;
      this.currentFishingTile = null;
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
