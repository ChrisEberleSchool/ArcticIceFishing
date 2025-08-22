import sizes from "../config/gameConfig.js";
import Phaser from "phaser";

export default class ShopUI {
  constructor(scene) {
    this.scene = scene;
    this.BG_HEIGHT_PADDING = -80;
    this.activeTab = "rodReel";

    // Items per tab
    this.itemsByTab = {
      rodReel: [
        "item",
        "item",
        "item",
        "item",
        "item",
        "item",
        "item",
        "item",
        "item",
        "item",
        "item",
        "item",
      ],
      lineTackle: ["item", "item", "item", "item"],
      lureBait: ["item", "item", "item", "item", "item"],
    };

    this.build();
    this.switchTab(this.activeTab); // initial tab
  }

  static preload(scene) {
    scene.load.image("shopBg", "./assets/ui/shop/shopBg.png");
    scene.load.image("item", "./assets/ui/shop/item.png");
    scene.load.image("rodReelTab", "./assets/ui/shop/rodReelTab.png");
    scene.load.image("lineTackleTab", "./assets/ui/shop/lineTackleTab.png");
    scene.load.image("lureBaitTab", "./assets/ui/shop/lureBaitTab.png");
  }

  build() {
    const { width, height } = sizes;

    // Main container
    this.mainContainer = this.scene.add.container(
      width / 2,
      height / 2 + this.BG_HEIGHT_PADDING
    );

    // Background
    this.bg = this.scene.add.image(0, 0, "shopBg").setOrigin(0.5);
    this.mainContainer.add(this.bg);

    // Exit Button
    this.exitButton = this.scene.add
      .image(0, height / 2.35, "exitButton")
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => {
        this.exitButton.setTint(0x999999);
      })
      .on("pointerout", () => {
        this.exitButton.clearTint();
      })
      .on("pointerdown", () => {
        console.log("Exit button clicked!");
        this.hide();
      });

    this.mainContainer.add(this.exitButton);

    // --- Tabs ---
    const tabNames = ["rodReel", "lineTackle", "lureBait"];
    const spacing = width / 5;
    const tabY = -height / 6;
    this.tabButtons = [];

    tabNames.forEach((name, i) => {
      const btn = this.scene.add
        .image(spacing * i - spacing, tabY, name + "Tab")
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => this.switchTab(name));
      btn.setDepth(10);
      this.tabButtons.push(btn);
      this.mainContainer.add(btn);
    });

    // --- Scroll area ---
    this.scrollArea = {
      x: -width / 3.2,
      y: -height / 10,
      width: width / 1.6,
      height: height / 2.2,
    };

    // Scroll box background
    this.scrollBox = this.scene.add.graphics();
    this.scrollBox
      .fillStyle(0x000000, 0)
      .fillRect(
        this.scrollArea.x,
        this.scrollArea.y,
        this.scrollArea.width,
        this.scrollArea.height
      );
    this.scrollBox.setDepth(1);
    this.mainContainer.add(this.scrollBox);

    // Container for items
    this.itemsContainer = this.scene.add.container(
      this.scrollArea.x,
      this.scrollArea.y
    );
    this.mainContainer.add(this.itemsContainer);

    // Mask
    const maskShape = this.scene.add.graphics();
    maskShape.fillStyle(0xffffff);
    maskShape.fillRect(
      this.mainContainer.x + this.scrollArea.x,
      this.mainContainer.y + this.scrollArea.y,
      this.scrollArea.width,
      this.scrollArea.height
    );
    const mask = maskShape.createGeometryMask();
    this.itemsContainer.setMask(mask);
    maskShape.setVisible(false);
  }

  // Layout items in grid
  layoutItems(items) {
    const scaleFactor = 1;
    // default scale 0.5
    this.itemsContainer.removeAll(true);

    const { width: scrollWidth, height: scrollHeight } = this.scrollArea;
    const padding = 10;
    let maxRow = 0;

    // Get size from first item for grid calculation
    const firstTexture = this.scene.textures.get(items[0]);
    const baseWidth = firstTexture.getSourceImage().width;
    const baseHeight = firstTexture.getSourceImage().height;

    const itemWidth = baseWidth * scaleFactor;
    const itemHeight = baseHeight * scaleFactor;

    const maxCols = Math.floor(scrollWidth / (itemWidth + padding));

    items.forEach((key, index) => {
      const col = index % maxCols;
      const row = Math.floor(index / maxCols);
      const x = col * (itemWidth + padding);
      const y = row * (itemHeight + padding);

      const item = this.scene.add
        .image(x, y, key)
        .setOrigin(0, 0)
        .setScale(scaleFactor); // scale image
      item.setInteractive({ useHandCursor: true });
      this.itemsContainer.add(item);

      maxRow = row;
    });

    this.itemsContainer.realHeight = (maxRow + 1) * (itemHeight + padding);

    this.createScrollbar();
  }
  // Create draggable scrollbar
  createScrollbar() {
    // Remove old scrollbar
    if (this.scrollThumb) this.scrollThumb.destroy();
    if (this.scrollTrack) this.scrollTrack.destroy();

    const {
      x: scrollX,
      y: scrollY,
      width: scrollWidth,
      height: scrollHeight,
    } = this.scrollArea;
    const scrollBarWidth = 20;
    const scrollBarX = scrollX + scrollWidth + 5;
    const scrollBarY = scrollY;

    // Track
    this.scrollTrack = this.scene.add.graphics();
    this.scrollTrack.fillStyle(0x333333, 0.5);
    this.scrollTrack.fillRect(
      scrollBarX,
      scrollBarY,
      scrollBarWidth,
      scrollHeight
    );
    this.mainContainer.add(this.scrollTrack);

    // Thumb height proportional to visible content
    this.scrollThumbHeight = Math.max(
      (scrollHeight / this.itemsContainer.realHeight) * scrollHeight,
      30
    );

    // Thumb graphics
    this.scrollThumb = this.scene.add.graphics();
    this.scrollThumb.fillStyle(0xaaaaaa, 1);
    this.scrollThumb.fillRect(0, 0, scrollBarWidth, this.scrollThumbHeight);

    // Position thumb
    this.scrollThumb.x = scrollBarX;
    this.scrollThumb.y = scrollBarY;

    // Add interactive hit area
    this.scrollThumb.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, scrollBarWidth, this.scrollThumbHeight),
      Phaser.Geom.Rectangle.Contains
    );

    this.mainContainer.add(this.scrollThumb);

    // Make thumb draggable
    this.scene.input.setDraggable(this.scrollThumb);
    this.scrollThumb.on("drag", (pointer, dragX, dragY) => {
      const minY = scrollBarY;
      const maxY = scrollBarY + scrollHeight - this.scrollThumbHeight;
      this.scrollThumb.y = Phaser.Math.Clamp(dragY, minY, maxY);

      // Map thumb position to itemsContainer scroll
      const scrollPercent =
        (this.scrollThumb.y - scrollBarY) /
        (scrollHeight - this.scrollThumbHeight);
      this.itemsContainer.y =
        scrollY +
        scrollPercent * (scrollHeight - this.itemsContainer.realHeight);
    });
  }

  // Switch tab
  switchTab(name) {
    this.activeTab = name;

    // Layout items
    const items = this.itemsByTab[name] || [];
    this.layoutItems(items);

    // Update tab button visuals
    this.tabButtons.forEach((btn) => {
      if (btn.texture.key === name + "Tab") {
        btn.setScale(1.1); // slightly larger
        btn.setTint(0xaaaaaa); // darker tint
      } else {
        btn.setScale(1); // default scale
        btn.clearTint(); // remove tint
      }
    });
  }

  // Show the shop UI
  show() {
    this.mainContainer.setVisible(true);
  }

  // Hide the shop UI
  hide() {
    this.mainContainer.setVisible(false);
  }
}
