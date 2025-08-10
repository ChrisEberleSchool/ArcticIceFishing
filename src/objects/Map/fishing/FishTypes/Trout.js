import Fish from "../Fish";

export default class Trout extends Fish {
  constructor() {
    super({
      name: "Rainbow Trout",
      spriteKey: "troutSprite",
      spritePath: "./assets/ui/FishUi/rainbow-trout.png",
      lengthRange: [12, 31],
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
    scene.load.image("troutSprite", "./assets/ui/FishUi/rainbow-trout.png");
  }
}
