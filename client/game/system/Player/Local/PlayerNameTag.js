export default class PlayerNameTag {
  constructor(scene, playerSprite, username, offset = 24) {
    this.offset = offset;
    this.text = scene.add
      .text(playerSprite.x, playerSprite.y - offset, username.toUpperCase(), {
        fontSize: "10px",
        color: "#00ffff",
        fontFamily: "'Orbitron', monospace",
        stroke: "#003344",
        strokeThickness: 2,
        letterSpacing: 1.5,
      })
      .setOrigin(0.5);
  }

  updatePosition(x, y) {
    this.text.x = x;
    this.text.y = y - this.offset;
  }

  destroy() {
    this.text.destroy();
  }
}
