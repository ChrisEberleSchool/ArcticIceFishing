export default class RemotePlayer {
  constructor(scene, x, y, username) {
    this.scene = scene;
    this.username = username;
    this.fishing = false;
    this.fishingState = null; // "cast", "idle", "fight"
    this.facing = "down";
    this.target = { x, y };
    this.smoothFactor = 0.1;

    this.sprite = scene.add
      .sprite(x, y, "playerIdleSheet")
      .setOrigin(0.5)
      .setScale(0.8); // Match local scale
    this.sprite.play("idle");

    this.nameText = scene.add
      .text(x, y - 24, username, {
        fontSize: "12px",
        color: "#ffffff",
        fontFamily: "Arial",
        stroke: "#000",
        strokeThickness: 3,
      })
      .setOrigin(0.5);
  }

  updateFromServer(data) {
    this.target = { x: data.x, y: data.y };
    this.fishing = data.fishing;
    this.fishingState = data.fishingState;
    this.facing = data.facing;
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
        if (
          !this.sprite.anims.isPlaying ||
          this.sprite.anims.currentAnim.key !== "fishing-cast-right"
        ) {
          this.sprite.anims.play("fishing-cast-right");
          this.sprite.once("animationcomplete", () => {
            if (this.fishing && this.fishingState === "cast") {
              this.fishingState = "idle"; // auto-transition to idle after cast
            }
          });
        }
        return;
      } else if (this.fishingState === "idle") {
        this.sprite.anims.play("fishing-idle-right", true);
        return;
      } else if (this.fishingState === "fight") {
        this.sprite.anims.play("fishing-fight-right", true);
        return;
      }
    }

    // Default idle animation based on facing direction
    this.sprite.anims.play(`idle-${this.facing}`, true);
  }

  destroy() {
    this.sprite.destroy();
    this.nameText.destroy();
  }
}
