// FishFactory.js
import Trout from "./FishTypes/Trout.js";
import Salmon from "./FishTypes/Salmon.js";

const ALL_FISH = [Trout, Salmon];

export default class FishFactory {
  static getRandomFish(equipment) {
    // Filter fish based on allowedEquipment
    const available = ALL_FISH.filter((FishClass) => {
      const fish = new FishClass();
      return fish.allowedEquipment.includes(equipment);
    });

    if (available.length === 0) {
      console.warn(`No fish available for equipment: ${equipment}`);
      return null;
    }

    // Pick a random type
    const FishClass = Phaser.Utils.Array.GetRandom(available);
    const fish = new FishClass();

    // Roll random length/weight/stats
    fish.generateStats();

    return fish;
  }

  static preloadAll(scene) {
    ALL_FISH.forEach((FishClass) => FishClass.preload(scene));
  }
}
