import Fish from "../../Fish";

export default class DollyVarden extends Fish {
  constructor() {
    super({
      name: "Dolly Varden",
      spriteKey: "dollyVardenSprite",
      spritePath: "./assets/Game/Fishing/FishTypes/legendary/dollyVarden.png",
      lengthRange: [12, 36],
      baseFishSpeed: 1.1,
      rewardPerInch: 50,
      allowedEquipment: ["basicRod", "advancedRod"],
      tier: "legendary",
    });
  }

  static preload(scene) {
    scene.load.image(
      "dollyVardenSprite",
      "./assets/Game/Fishing/FishTypes/legendary/dollyVarden.png"
    );
  }
}
