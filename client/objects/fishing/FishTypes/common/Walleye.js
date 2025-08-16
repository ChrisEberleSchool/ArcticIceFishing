import Fish from "../../Fish";

export default class Walleye extends Fish {
  constructor() {
    super({
      name: "Walleye",
      spriteKey: "walleyeSprite",
      spritePath: "./assets/ui/FishUi/common/walleye.png",
      lengthRange: [12, 42],
      baseFishSpeed: 0.4,
      rewardPerInch: 15,
      allowedEquipment: ["basicRod", "advancedRod"],
      tier: "common",
    });
  }

  static preload(scene) {
    scene.load.image("walleyeSprite", "./assets/ui/FishUi/common/walleye.png");
  }
}
