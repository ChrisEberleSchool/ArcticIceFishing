import Fish from "../Fish";

export default class Salmon extends Fish {
  constructor() {
    super({
      name: "Salmon",
      spriteKey: "salmonSprite",
      spritePath: "./assets/ui/FishUi/salmon.png",
      lengthRange: [20, 30],
      weightRange: [1, 4],
      baseFishSpeed: 0.6,
      rewardPerKg: 50,
      allowedEquipment: ["basicRod", "advancedRod"],
      basePullFrequency: 1.3,
      basePullSpeed: 1.2,
      tier: "uncommon",
    });
  }

  static preload(scene) {
    scene.load.image("salmonSprite", "./assets/ui/FishUi/salmon.png");
  }
}
