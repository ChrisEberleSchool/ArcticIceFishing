import Phaser from "phaser";

export default class Item {
  constructor({ name, iconKey, iconPath, price, desc }) {
    this.name = name;
    this.iconKey = iconKey;
    this.iconPath = iconPath;
    this.price = price;
    this.desc = desc;
  }

  static preload(scene) {
    throw new Error("Subclasses must implement preload()");
  }
}
