import Fish from "../../Fish";

export default class BlueFinTuna extends Fish {
  constructor() {
    super({
      name: "Blue Fin Tuna",
      spriteKey: "blueFinTunaSprite",
      spritePath: "./assets/ui/FishUi/legendary/blueFinTuna.png",
      lengthRange: [50, 150],
      baseFishSpeed: 1.2,
      rewardPerInch: 50,
      allowedEquipment: ["basicRod", "advancedRod"],
      tier: "legendary",
    });
  }

  static preload(scene) {
    scene.load.image(
      "blueFinTunaSprite",
      "./assets/ui/FishUi/legendary/blueFinTuna.png"
    );
  }
}
