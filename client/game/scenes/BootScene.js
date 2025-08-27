// BootScene.js
import Phaser from "phaser";
import LoginSignupPage from "../ui/startUI/LoginSignupPage.js";
import LoginPage from "../ui/startUI/LoginPage.js";
import SignupPage from "../ui/startUI/SignupPage.js";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
    this.authReady = false;
  }

  preload() {
    this.cameras.main.setBackgroundColor("#1a1a1a");

    // load loading sprite sheet
    this.load.spritesheet(
      "loading",
      "./assets/Game/loading/loadingScreen.png",
      {
        frameWidth: 40,
        frameHeight: 18,
      }
    );

    // cwait for sprite sheet to load
    this.load.once("complete", () => {
      this.createLoadingAnim();
      this.startAuthPreload();
    });
  }

  createLoadingAnim() {
    const { width, height } = this.scale;
    const loadingSprite = this.add.sprite(width / 2, height / 2, "loading");

    this.anims.create({
      key: "loadingAnim",
      frames: this.anims.generateFrameNumbers("loading", { start: 0, end: 5 }),
      frameRate: 8,
      repeat: -1,
    });

    loadingSprite.play("loadingAnim");
  }

  startAuthPreload() {
    // preload assets needed for auth
    LoginSignupPage.preload(this);
    LoginPage.preload(this);
    SignupPage.preload(this);

    this.load.once("complete", () => {
      // after auth assets are loaded launch AuthScene
      this.scene.launch("scene-auth");

      const authScene = this.scene.get("scene-auth");
      authScene.events.once("ready", () => {
        this.authReady = true;
        this.checkReady();
      });
    });

    // manually start this *second* loading pass
    this.load.start();
  }

  checkReady() {
    if (this.authReady) {
      this.scene.stop(); // stop BootScene so only AuthScene remains
    }
  }
}
