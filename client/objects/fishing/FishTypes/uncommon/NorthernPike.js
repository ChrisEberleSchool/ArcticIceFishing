import Fish from "../../Fish";

export default class NorthernPike extends Fish {
  constructor() {
    super({
      name: "Northern Pike",
      spriteKey: "northernPikeSprite",
      spritePath: "./assets/ui/FishUi/uncommon/northernPike.png",
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
      "./assets/ui/FishUi/uncommon/northernPike.png"
    );
  }
}
