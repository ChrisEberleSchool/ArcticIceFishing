import Phaser from "phaser";
import sizes from "../../config/gameConfig.js";

export default class ShopSlot {
  constructor(scene, x, y, item = null) {
    this.scene = scene;
    this.item = item;

    // Slot container
    this.container = scene.add.container(x, y);

    // Slot background (always visible)
    this.slotBg = scene.add.image(0, 0, "item").setOrigin(0.5);
    this.container.add(this.slotBg);

    // If an item is provided, draw it
    if (this.item) {
      // --- Icon ---
      this.icon = scene.add.image(0, 0, this.item.iconKey).setOrigin(0.5);

      // Scale the icon so it always fits inside slot
      const maxIconWidth = this.slotBg.width * 0.8;
      const maxIconHeight = this.slotBg.height * 0.8;
      const scaleX = maxIconWidth / this.icon.width;
      const scaleY = maxIconHeight / this.icon.height;
      const scale = Math.min(scaleX, scaleY);
      this.icon.setScale(scale);

      this.container.add(this.icon);
      // Name above
      this.nameText = scene.add
        .text(
          0,
          -this.slotBg.height * 0.4, // move up relative to center
          this.item.name,
          { fontSize: "30px", color: "#ffff00", align: "center" }
        )
        .setOrigin(0.5);
      this.container.add(this.nameText);
      // Price below
      this.priceText = scene.add
        .text(
          0,
          this.slotBg.height * 0.4, // move down relative to center
          `$${this.item.price}`,
          { fontSize: "30px", color: "#ffff00", align: "center" }
        )
        .setOrigin(0.5);
      this.container.add(this.priceText);

      // --- Interaction bounds match slot size ---
      this.container.setInteractive(
        new Phaser.Geom.Rectangle(
          -this.slotBg.displayWidth / 2, // left edge
          -this.slotBg.displayHeight / 2, // top edge
          this.slotBg.displayWidth, // width
          this.slotBg.displayHeight // height
        ),
        Phaser.Geom.Rectangle.Contains
      );

      // Add click listener
      this.container.on("pointerdown", () => {
        if (this.item) {
          console.log(this.item.desc); // print item description
        }
      });
      // --- Hover scaling effect ---
      this.container.on("pointerover", () => {
        this.scene.tweens.add({
          targets: this.container,
          scale: 1.1,
          duration: 150, // smooth in (ms)
          ease: "Power2",
        });
      });

      this.container.on("pointerout", () => {
        this.scene.tweens.add({
          targets: this.container,
          scale: 1,
          duration: 150, // smooth out
          ease: "Power2",
        });
      });
    }
  }

  getGameObject() {
    return this.container;
  }
}
