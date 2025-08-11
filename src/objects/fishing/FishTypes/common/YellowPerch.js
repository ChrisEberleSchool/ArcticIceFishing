import Fish from "../../Fish";

export default class YellowPerch extends Fish {
  constructor() {
    super({
      name: "Yellow Perch",
      spriteKey: "yellowPerchSprite",
      spritePath: "./assets/ui/FishUi/common/yellowPerch.png",
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
      "./assets/ui/FishUi/common/yellowPerch.png"
    );
  }
}
