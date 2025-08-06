export default class Player {
  constructor(scene, x, y, username) {
    this.scene = scene;
    this.username = username;
    this.target = null;
    this.speed = 300;

    // Create sprite
    this.sprite = scene.physics.add
      .sprite(x, y, "playerIdleSheet")
      .setOrigin(0.5)
      .setScale(2);
    this.sprite.play("idle");

    // Create name label
    this.nameText = scene.add
      .text(x, y - 24, username, {
        fontSize: "12px",
        color: "#ffffff",
        fontFamily: "Arial",
        stroke: "#000",
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    this.scene.cameras.main.startFollow(this.sprite);
    this.scene.cameras.main.zoom = 2.5;
  }

  moveTo(x, y) {
    this.target = { x, y };
  }

  update() {
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

    if (dist < 4) {
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
    this.nameText.y = this.sprite.y - 24;
  }

  destroy() {
    this.sprite.destroy();
    this.nameText.destroy();
  }

  get x() {
    return this.sprite.x;
  }

  get y() {
    return this.sprite.y;
  }
}
