export default class RemotePlayer {
  constructor(scene, x, y, username) {
    this.scene = scene;
    this.username = username;
    this.fishing = false;
    this.fishingState = null; // "cast", "idle", "fight"
    this.facing = "down";
    this.target = { x, y };
    this.smoothFactor = 0.1;
    this.isMoving = this.isMoving;

    this.sprite = scene.add
      .sprite(x, y, "playerIdleSheet")
      .setOrigin(0.5)
      .setScale(0.8); // Match local scale
    this.sprite.play("idle");

    this.nameText = scene.add
      .text(x, y - 24, username.toUpperCase(), {
        fontSize: "8px",
        color: "#00ffff", // neon cyan-ish
        fontFamily: "'Orbitron', monospace", // sci-fi style font
        stroke: "#003344",
        strokeThickness: 4,
        letterSpacing: 2,
      })
      .setOrigin(0.5);
  }

  updateFromServer(data) {
    this.target = { x: data.x, y: data.y };
    this.fishing = data.fishing;
    this.fishingState = data.fishingState;
    this.facing = data.facing;
    this.isMoving = data.isMoving;
  }

  update() {
    if (!this.target) return;

    const dist = Phaser.Math.Distance.Between(
      this.sprite.x,
      this.sprite.y,
      this.target.x,
      this.target.y
    );

    if (dist < 1) {
      this.sprite.x = this.target.x;
      this.sprite.y = this.target.y;
    } else {
      this.sprite.x += (this.target.x - this.sprite.x) * this.smoothFactor;
      this.sprite.y += (this.target.y - this.sprite.y) * this.smoothFactor;
    }

    this.nameText.x = this.sprite.x;
    this.nameText.y = this.sprite.y - 24;

    this.updateAnimation();
  }

  updateAnimation() {
    if (this.fishing) {
      if (this.fishingState === "cast") {
        this.sprite.anims.play("fishing-cast-right", true);
        return;
      } else if (this.fishingState === "idle") {
        this.sprite.anims.play("fishing-idle-right", true);
        return;
      } else if (this.fishingState === "fight") {
        this.sprite.anims.play("fishing-fight-right", true);
        return;
      } else if (this.fishingState === "caught") {
        this.sprite.anims.play("fishing-caught-right", true);
        return;
      }
      return;
    }

    // This code will not re reached if fishing is true
    if (!this.isMoving) {
      this.sprite.anims.play(`idle-${this.facing}`, true);
    } else {
      this.sprite.anims.play(`walk-${this.facing}`, true);
    }
  }
  destroy() {
    this.sprite.destroy();
    this.nameText.destroy();
  }
}
