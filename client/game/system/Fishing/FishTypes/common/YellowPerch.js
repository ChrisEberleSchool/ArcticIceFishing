import Fish from "../../Fish";

export default class YellowPerch extends Fish {
  constructor() {
    super({
      name: "Yellow Perch",
      spriteKey: "yellowPerchSprite",
      spritePath: "./assets/Game/Fishing/FishTypes/common/yellowPerch.png",
      lengthRange: [6, 12],
      baseFishSpeed: 0.3,
      rewardPerInch: 15,
      allowedEquipment: ["basicRod", "advancedRod"],
      tier: "common",
    });
  }

  static preload(scene) {
    scene.load.image(
      "yellowPerchSprite",
      "./assets/Game/Fishing/FishTypes/common/yellowPerch.png"
    );
  }
}
