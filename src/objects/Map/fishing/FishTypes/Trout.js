import Fish from "../Fish";

export default class Trout extends Fish {
  constructor() {
    super({
      name: "Trout",
      spriteKey: "troutSprite",
      spritePath: "./assets/fish/trout.png",
      lengthRange: [20, 40],
      weightRange: [1, 4],
      baseFishSpeed: 0.6,
      rewardPerKg: 50,
      allowedEquipment: ["basicRod", "advancedRod"],
      basePullFrequency: 1.2,
      basePullSpeed: 1.2,
      tier: "common",
    });
  }

  static preload(scene) {
    scene.load.image("troutSprite", "./assets/fish/trout.png");
  }
}
