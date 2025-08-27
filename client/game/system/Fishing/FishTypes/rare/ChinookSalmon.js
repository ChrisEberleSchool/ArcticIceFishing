import Fish from "../../Fish.js";

export default class ChinookSalmon extends Fish {
  constructor() {
    super({
      name: "Chinook Salmon",
      spriteKey: "chinookSalmonSprite",
      spritePath: "./assets/Game/Fishing/FishTypes/rare/chinookSalmon.png",
      lengthRange: [24, 58],
      baseFishSpeed: 0.6,
      rewardPerInch: 35,
      allowedEquipment: ["basicRod", "advancedRod"],
      tier: "rare",
    });
  }

  static preload(scene) {
    scene.load.image(
      "chinookSalmonSprite",
      "./assets/Game/Fishing/FishTypes/rare/chinookSalmon.png"
    );
  }
}
