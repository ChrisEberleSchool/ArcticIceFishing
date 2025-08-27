import AdvancedRod from "./items/AdvancedRod";

const ALL_ITEMS = [AdvancedRod];

export default class ItemFactory {
  static preloadAll(scene) {
    ALL_ITEMS.forEach((ItemClass) => ItemClass.preload(scene));
  }
}
