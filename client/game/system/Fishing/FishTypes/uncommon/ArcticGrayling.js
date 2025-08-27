import Fish from "../../Fish";

export default class ArcticGrayling extends Fish {
  constructor() {
    super({
      name: "Arctic Grayling",
      spriteKey: "arcticGraylingSprite",
      spritePath: "./assets/Game/Fishing/FishTypes/uncommon/arcticGrayling.png",
      lengthRange: [12, 20],
      baseFishSpeed: 0.6,
      rewardPerInch: 25,
      allowedEquipment: ["basicRod", "advancedRod"],
      tier: "uncommon",
    });
  }

  static preload(scene) {
    scene.load.image(
      "arcticGraylingSprite",
      "./assets/Game/Fishing/FishTypes/uncommon/arcticGrayling.png"
    );
  }
}
