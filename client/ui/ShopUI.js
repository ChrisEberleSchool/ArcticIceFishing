import Phaser from "phaser";

export default class ShopUI {
  constructor(scene, x, y, width, height) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.activeTab = "equipment"; // default tab
    this.tabs = {};
    this.scrollY = 0;

    this.build();
    this.hide(); // hidden until opened
  }

  static preload(scene) {
    scene.load.image("shopBg", "./assets/ui/shop/shopBg.png");
    scene.load.image("item", "./assets/ui/shop/item.png");
    scene.load.image("tab", "./assets/ui/shop/tab.png");
  }

  build() {
    // --- Background ---
    this.bg = this.scene.add.image(this.x, this.y, "shopBg").setOrigin(0.5);

    // --- Tabs ---
    const tabNames = ["equipment", "clothes", "bait", "misc"];
    this.tabButtons = [];

    tabNames.forEach((name, index) => {
      let btn = this.scene.add
        .text(
          this.x - this.width / 2 + 60 * index,
          this.y - this.height / 2 - 30,
          name.toUpperCase(),
          {
            fontSize: "16px",
            color: "#fff",
            backgroundColor: "#333",
            padding: 4,
          }
        )
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => this.switchTab(name));

      this.tabButtons.push(btn);
    });

    // --- Containers per tab ---
    this.tabContainers = {};
    tabNames.forEach((name) => {
      let container = this.scene.add.container(this.x, this.y);
      container.visible = false;
      this.tabContainers[name] = container;
    });

    // Example items for each tab
    for (let i = 0; i < 15; i++) {
      let item = this.scene.add.image(0, i * 50, "item").setOrigin(0.5);
      this.tabContainers["equipment"].add(item);
    }
    for (let i = 0; i < 8; i++) {
      let item = this.scene.add
        .image(0, i * 50, "item")
        .setOrigin(0.5)
        .setTint(0xff0000);
      this.tabContainers["clothes"].add(item);
    }

    // --- Mask ---
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
    maskShape.destroy();

    Object.values(this.tabContainers).forEach((container) =>
      container.setMask(mask)
    );

    // --- Input scroll ---
    this.scene.input.on("wheel", (pointer, gameObjects, dx, dy) => {
      this.scrollY += dy;
      this.refreshScroll();
    });

    this.switchTab("equipment");
  }

  switchTab(name) {
    this.activeTab = name;
    this.scrollY = 0;

    Object.entries(this.tabContainers).forEach(([tabName, container]) => {
      container.visible = tabName === name;
    });

    this.refreshScroll();
  }

  refreshScroll() {
    let container = this.tabContainers[this.activeTab];
    if (!container) return;

    let totalHeight = container.list.length * 50;
    let maxScroll = Math.max(0, totalHeight - this.height);

    this.scrollY = Phaser.Math.Clamp(this.scrollY, 0, maxScroll);
    container.y = this.y - this.scrollY;
  }

  show() {
    this.bg.setVisible(true);
    this.tabButtons.forEach((btn) => btn.setVisible(true));
    Object.values(this.tabContainers).forEach((c) =>
      c.setVisible(c === this.tabContainers[this.activeTab])
    );
  }

  hide() {
    this.bg.setVisible(false);
    this.tabButtons.forEach((btn) => btn.setVisible(false));
    Object.values(this.tabContainers).forEach((c) => c.setVisible(false));
  }

  toggle() {
    if (this.bg.visible) {
      this.hide();
    } else {
      this.show();
    }
  }
}
