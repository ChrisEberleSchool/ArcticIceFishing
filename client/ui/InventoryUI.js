import Phaser from "phaser";

export default class InventoryUI {
  constructor(scene, x, y, width, height) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.scrollY = 0;
    this.maxScroll = 0;

    this.build();
  }

  static preload(scene) {
    scene.load.image("inventoryBg", "./assets/ui/inventory/tackleboxBg.png");
    scene.load.image("item", "./assets/ui/inventory/item.png");
  }

  build() {
    // Background sprite
    this.bg = this.scene.add
      .image(this.x, this.y, "inventoryBg")
      .setOrigin(0.5);

    // Container for items
    this.container = this.scene.add.container(this.x, this.y);

    // Example items (replace with real inventory later)
    for (let i = 0; i < 20; i++) {
      let item = this.scene.add.image(0, i * 50, "item").setOrigin(0.5);
      this.container.add(item);
    }

    // Calculate scroll range
    this.maxScroll = Math.max(0, this.container.list.length * 50 - this.height);

    // Mask (clip to background size)
    const maskShape = this.scene.add
      .graphics()
      .fillStyle(0xffffff)
      .fillRect(
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height
      );

    const mask = maskShape.createGeometryMask();
    this.container.setMask(mask);
    maskShape.destroy();

    // Mouse wheel scrolling
    this.scene.input.on("wheel", (pointer, gameObjects, dx, dy) => {
      this.scrollY += dy;
      this.scrollY = Phaser.Math.Clamp(this.scrollY, 0, this.maxScroll);
      this.container.y = this.y - this.scrollY;
    });
  }
}
