import Fish from "../Fish";

export default class Salmon extends Fish {
  constructor() {
    super({
      name: "Salmon",
      spriteKey: "salmonSprite",
      spritePath: "./assets/fish/salmon.png",
      lengthRange: [20, 40],
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
    scene.load.image("salmonSprite", "./assets/fish/salmon.png");
  }
}
