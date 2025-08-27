import Fish from "../../Fish";

export default class WhiteSucker extends Fish {
  constructor() {
    super({
      name: "White Sucker",
      spriteKey: "whiteSuckerSprite",
      spritePath: "./assets/Game/Fishing/FishTypes/common/whiteSucker.png",
      lengthRange: [12, 23],
      baseFishSpeed: 0.4,
      rewardPerInch: 15,
      allowedEquipment: ["basicRod", "advancedRod"],
      tier: "common",
    });
  }

  static preload(scene) {
    scene.load.image(
      "whiteSuckerSprite",
      "./assets/Game/Fishing/FishTypes/common/whiteSucker.png"
    );
  }
}
