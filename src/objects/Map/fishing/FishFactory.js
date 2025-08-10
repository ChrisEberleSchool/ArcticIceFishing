import Trout from "./FishTypes/Trout.js";
import Salmon from "./FishTypes/Salmon.js";
import BlueFinTuna from "./FishTypes/BlueFinTuna.js";

const ALL_FISH = [Trout, Salmon, BlueFinTuna];

const TIER_SPAWN_WEIGHTS = {
  common: 50,
  uncommon: 25,
  rare: 15,
  epic: 7,
  legendary: 3,
};

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

    // Build weighted array
    const weightedFish = [];
    available.forEach((FishClass) => {
      const fish = new FishClass();
      const weight = TIER_SPAWN_WEIGHTS[fish.tier] || 1;
      for (let i = 0; i < weight; i++) {
        weightedFish.push(FishClass);
      }
    });

    // Pick a random fish weighted by tier
    const FishClass = Phaser.Utils.Array.GetRandom(weightedFish);
    const fish = new FishClass();

    fish.generateStats();

    return fish;
  }

  static preloadAll(scene) {
    ALL_FISH.forEach((FishClass) => FishClass.preload(scene));
  }
}
