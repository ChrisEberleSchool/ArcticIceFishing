export default class InputManager {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;

    this.pointerDownHandler = this.onPointerDown.bind(this);
    this.pointerUpHandler = this.onPointerUp.bind(this);

    this.init();
  }

  init() {
    this.scene.input.mouse.disableContextMenu();
    this.scene.input.addPointer(2);

    this.scene.input.on("pointerdown", this.pointerDownHandler);
    this.scene.input.on("pointerup", this.pointerUpHandler);
  }

  onPointerDown(pointer) {
    if (this.player.playerState.inShop) {
      return;
    }

    if (this.player.fishingController.fishingSession?.fightActive) {
      this.player.fishingController.fishingSession.handlePointerDown(pointer);
    } else {
      if (pointer.pointerType === "mouse" && pointer.rightButtonDown()) return;
      if (document.activeElement.tagName === "INPUT") return;
      this.player.moveTo(pointer.worldX, pointer.worldY);
    }
  }

  onPointerUp(pointer) {
    if (this.player.fishingController.fishingSession?.fightActive) {
      this.player.fishingController.fishingSession.handlePointerUp(pointer);
    }
  }

  destroy() {
    this.scene.input.off("pointerdown", this.pointerDownHandler);
    this.scene.input.off("pointerup", this.pointerUpHandler);
  }
}
