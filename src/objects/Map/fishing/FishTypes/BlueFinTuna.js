import Fish from "../Fish";

export default class BlueFinTuna extends Fish {
  constructor() {
    super({
      name: "Blue Fin Tuna",
      spriteKey: "blueFinTunaSprite",
      spritePath: "./assets/ui/FishUi/blueFinTuna.png",
      lengthRange: [50, 150],
      baseFishSpeed: 1.1,
      rewardPerInch: 50,
      allowedEquipment: ["basicRod", "advancedRod"],
      tugCooldownRange: [800, 2000],
      tugDurationRange: [500, 2000],
      tier: "rare",
    });
  }

  static preload(scene) {
    scene.load.image("blueFinTunaSprite", "./assets/ui/FishUi/blueFinTuna.png");
  }
}
