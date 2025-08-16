import Fish from "../../Fish";

export default class RainbowTrout extends Fish {
  constructor() {
    super({
      name: "Rainbow Trout",
      spriteKey: "rainbowTroutSprite",
      spritePath: "./assets/ui/FishUi/common/rainbowTrout1.png",
      lengthRange: [8, 31],
      baseFishSpeed: 0.5,
      rewardPerInch: 15,
      allowedEquipment: ["basicRod", "advancedRod"],
      tier: "common",
    });
  }

  static preload(scene) {
    scene.load.image(
      "rainbowTroutSprite",
      "./assets/ui/FishUi/common/rainbowTrout1.png"
    );
  }
}
