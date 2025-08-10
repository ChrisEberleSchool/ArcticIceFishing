import Fish from "../Fish";

export default class Salmon extends Fish {
  constructor() {
    super({
      name: "Salmon",
      spriteKey: "salmonSprite",
      spritePath: "./assets/ui/FishUi/salmon.png",
      lengthRange: [20, 30],
      baseFishSpeed: 0.6,
      rewardPerInch: 25,
      allowedEquipment: ["basicRod", "advancedRod"],
      tugCooldownRange: [1000, 2000],
      tugDurationRange: [1250, 3000],
      tier: "uncommon",
    });
  }

  static preload(scene) {
    scene.load.image("salmonSprite", "./assets/ui/FishUi/salmon.png");
  }
}
