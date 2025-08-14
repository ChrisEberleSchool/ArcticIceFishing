import socket from "../../network/socket";

export default class LoginSignupPage {
  constructor(scene) {
    this.scene = scene;

    // Background
    this.bg = scene.add.image(0, 0, "0bg").setOrigin(0).setVisible(false);
    this.bg.displayWidth = scene.sys.game.config.width;
    this.bg.displayHeight = scene.sys.game.config.height;

    // Buttons
    const horizontalButtonOffset = 500;
    const verticalButtonOffset = 200;

    this.loginBtn = scene.add
      .image(
        scene.sys.game.config.width - horizontalButtonOffset,
        scene.sys.game.config.height - verticalButtonOffset,
        "0loginButton"
      )
      .setOrigin(0.5, 0.5)
      .setInteractive({ useHandCursor: true });

    this.loginBtn.on("pointerdown", () => {
      this.close();
      this.scene.showLoginPage();
    });

    this.createBtn = scene.add
      .image(
        horizontalButtonOffset,
        scene.sys.game.config.height - verticalButtonOffset,
        "0createButton"
      )
      .setOrigin(0.5, 0.5)
      .setInteractive({ useHandCursor: true });

    this.createBtn.on("pointerdown", () => {
      this.close();
      this.scene.showSignupPage();
    });
  }

  static preload(scene) {
    scene.load.image("0bg", "./assets/ui/landingUI/bg.png");
    scene.load.image("0createButton", "./assets/ui/landingUI/createButton.png");
    scene.load.image("0loginButton", "./assets/ui/landingUI/loginButton.png");
  }

  open() {
    this.bg.setVisible(true);
    this.loginBtn.setVisible(true);
    this.createBtn.setVisible(true);
  }

  close() {
    this.bg.setVisible(false);
    this.loginBtn.setVisible(false);
    this.createBtn.setVisible(false);
  }
}
