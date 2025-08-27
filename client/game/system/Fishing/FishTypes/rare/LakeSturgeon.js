import Fish from "../../Fish.js";

export default class LakeSturgeon extends Fish {
  constructor() {
    super({
      name: "Lake Sturgeon",
      spriteKey: "lakeSturgeonSprite",
      spritePath: "./assets/Game/Fishing/FishTypes/rare/lakeSturgeon.png",
      lengthRange: [28, 58],
      baseFishSpeed: 0.65,
      rewardPerInch: 35,
      allowedEquipment: ["basicRod", "advancedRod"],
      tier: "rare",
    });
  }

  static preload(scene) {
    scene.load.image(
      "lakeSturgeonSprite",
      "./assets/Game/Fishing/FishTypes/rare/lakeSturgeon.png"
    );
  }
}
