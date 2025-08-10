import Fish from "../Fish";

export default class Trout extends Fish {
  constructor() {
    super({
      name: "Rainbow Trout",
      spriteKey: "troutSprite",
      spritePath: "./assets/ui/FishUi/rainbow-trout.png",
      lengthRange: [12, 31],
      baseFishSpeed: 0.5,
      rewardPerInch: 15,
      allowedEquipment: ["basicRod", "advancedRod"],
      tugCooldownRange: [2500, 3000],
      tugDurationRange: [1000, 1500],
      tier: "common",
    });
  }

  static preload(scene) {
    scene.load.image("troutSprite", "./assets/ui/FishUi/rainbow-trout.png");
  }
}
