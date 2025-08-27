import Fish from "../../Fish";

export default class BrownTrout extends Fish {
  constructor() {
    super({
      name: "Brown Trout",
      spriteKey: "brownTroutprite",
      spritePath: "./assets/Game/Fishing/FishTypes/uncommon/brownTrout1.png",
      lengthRange: [14, 38],
      baseFishSpeed: 0.55,
      rewardPerInch: 25,
      allowedEquipment: ["basicRod", "advancedRod"],
      tier: "uncommon",
    });
  }

  static preload(scene) {
    scene.load.image(
      "brownTroutprite",
      "./assets/Game/Fishing/FishTypes/uncommon/brownTrout1.png"
    );
  }
}
