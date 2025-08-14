import Phaser from "phaser";

export default class LoadingScene extends Phaser.Scene {
  constructor() {
    super("LoadingScene");
  }

  preload() {
    // Add loading bar
    const progressBar = this.add.graphics();
    this.load.on("progress", (value) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(0, 300, 800 * value, 50);
    });
    console.log("LOADING SCENE STARTED");
  }

  create(data) {
    const username = data?.username;
    if (!username) {
      console.error("Missing username for GameScene!");
      return;
    }
    this.scene.start("scene-game", { username });

    // Launch the UI scene so it runs in parallel
    if (!this.scene.isActive("scene-ui")) {
      this.scene.launch("scene-ui", { username });
    }

    // Optional: bring the UI on top
    this.scene.bringToTop("scene-ui");
  }
}
