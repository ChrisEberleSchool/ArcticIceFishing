// Common Fish
import RainbowTrout from "./FishTypes/common/RainbowTrout.js";
import YellowPerch from "./FishTypes/common/YellowPerch.js";
import WhiteSucker from "./FishTypes/common/WhiteSucker.js";
import Walleye from "./FishTypes/common/Walleye.js";

// Uncommon Fish
import NorthernPike from "./FishTypes/uncommon/NorthernPike.js";
import BrownTrout from "./FishTypes/uncommon/BrownTrout.js";
import ArcticGrayling from "./FishTypes/uncommon/ArcticGrayling.js";

// Rare Fish
import ChinookSalmon from "./FishTypes/rare/ChinookSalmon.js";
import Muskellunge from "./FishTypes/rare/Muskellunge.js";
import LakeSturgeon from "./FishTypes/rare/LakeSturgeon.js";

// Legendary Fish
import BlueFinTuna from "./FishTypes/legendary/BlueFinTuna.js";
import DollyVarden from "./FishTypes/legendary/DollyVarden.js";
import Arapaima from "./FishTypes/legendary/Arapaima.js";

const ALL_FISH = [
  RainbowTrout,
  WhiteSucker,
  YellowPerch,
  Walleye,

  NorthernPike,
  BrownTrout,
  ArcticGrayling,

  ChinookSalmon,
  Muskellunge,
  LakeSturgeon,

  BlueFinTuna,
  DollyVarden,
  Arapaima,
];

const TIER_SPAWN_WEIGHTS = {
  common: 40,
  uncommon: 34,
  rare: 18,
  legendary: 8,
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
