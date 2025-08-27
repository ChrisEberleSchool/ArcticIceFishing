export default class Item {
  constructor({ name, iconKey, iconPath, price, isStackable, desc }) {
    this.name = name;
    this.iconKey = iconKey;
    this.iconPath = iconPath;
    this.price = price;
    this.isStackable = isStackable;
    this.desc = desc;
  }

  static preload(scene) {
    throw new Error("Subclasses must implement preload()");
  }
}
