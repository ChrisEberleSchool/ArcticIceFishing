import Fish from "../../Fish";

export default class Arapaima extends Fish {
  constructor() {
    super({
      name: "Arapaima",
      spriteKey: "arapaimaSprite",
      spritePath: "./assets/ui/FishUi/legendary/arapaima.png",
      lengthRange: [79.2, 180],
      baseFishSpeed: 1.1,
      rewardPerInch: 50,
      allowedEquipment: ["basicRod", "advancedRod"],
      tier: "legendary",
    });
  }

  static preload(scene) {
    scene.load.image(
      "arapaimaSprite",
      "./assets/ui/FishUi/legendary/arapaima.png"
    );
  }
}
