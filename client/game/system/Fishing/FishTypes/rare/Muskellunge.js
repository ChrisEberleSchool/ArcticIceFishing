import Fish from "../../Fish.js";

export default class Muskellunge extends Fish {
  constructor() {
    super({
      name: "Muskellunge",
      spriteKey: "muskellungeSprite",
      spritePath: "./assets/Game/Fishing/FishTypes/rare/muskellunge.png",
      lengthRange: [28, 58],
      baseFishSpeed: 0.65,
      rewardPerInch: 35,
      allowedEquipment: ["basicRod", "advancedRod"],
      tier: "rare",
    });
  }

  static preload(scene) {
    scene.load.image(
      "muskellungeSprite",
      "./assets/Game/Fishing/FishTypes/rare/muskellunge.png"
    );
  }
}
