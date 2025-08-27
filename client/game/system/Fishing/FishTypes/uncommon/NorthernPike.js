import Fish from "../../Fish";

export default class NorthernPike extends Fish {
  constructor() {
    super({
      name: "Northern Pike",
      spriteKey: "northernPikeSprite",
      spritePath: "./assets/Game/Fishing/FishTypes/uncommon/northernPike.png",
      lengthRange: [18, 54],
      baseFishSpeed: 0.4,
      rewardPerInch: 25,
      allowedEquipment: ["basicRod", "advancedRod"],
      tier: "uncommon",
    });
  }

  static preload(scene) {
    scene.load.image(
      "northernPikeSprite",
      "./assets/Game/Fishing/FishTypes/uncommon/northernPike.png"
    );
  }
}
