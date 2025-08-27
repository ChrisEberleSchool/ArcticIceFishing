import Item from "../Item.js";

export default class AdvancedRod extends Item {
  constructor() {
    super({
      name: "Advanced Rod",
      iconKey: "advancedRodIcon",
      iconPath: "./assets/Game/items/rods/advancedRodIcon.png",
      price: 5000,
      isStackable: false,
      desc: "A high-performance fishing rod crafted from lightweight carbon fiber. Designed for improved casting distance and precision, it offers durability and control that makes landing larger, tougher fish much easier. Perfect for anglers looking to upgrade from beginner gear.",
    });
  }

  static preload(scene) {
    scene.load.image(
      "advancedRodIcon",
      "./assets/Game/items/rods/advancedRodIcon.png"
    );
  }
}
