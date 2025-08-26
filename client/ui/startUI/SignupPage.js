import socket from "../../network/socket";

export default class SignupPage {
  constructor(scene) {
    this.scene = scene;

    this.gameWidth = scene.sys.game.config.width;
    this.gameHeight = scene.sys.game.config.height;

    // Background
    this.bg = scene.add.image(0, 0, "signupBg").setOrigin(0).setVisible(false);
    this.bg.displayWidth = this.gameWidth;
    this.bg.displayHeight = this.gameHeight;

    // Buttons
    this.horizontalButtonOffset = 650;
    this.verticalButtonOffset = 100;

    this.signupBtn = scene.add
      .image(
        this.gameWidth - this.horizontalButtonOffset,
        this.gameHeight - this.verticalButtonOffset,
        "signupButton"
      )
      .setOrigin(0.5, 0.5)
      .setInteractive({ useHandCursor: true });

    this.signupBtn.on("pointerdown", () => {
      this.handleSignup();
    });

    this.backBtn = scene.add
      .image(
        this.horizontalButtonOffset,
        this.gameHeight - this.verticalButtonOffset,
        "signupBackButton"
      )
      .setOrigin(0.5, 0.5)
      .setInteractive({ useHandCursor: true });

    this.backBtn.on("pointerdown", () => {
      this.close();
      this.scene.showLoginSignupPage();
    });

    // DOM form (Phaser-managed positioning)
    this.signupForm = scene.add
      .dom(this.gameWidth / 2, this.gameHeight / 2)
      .createFromHTML(
        `
        <div style="display:flex; flex-direction:column; gap:200px; align-items:center;">
          <input id="usernameSignup"
            style="
              background-color: transparent !important;
              color: white !important;
              -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;;
              border: none;
              outline: none;
              color: white;
              font-size: 80px;
              text-align: center;
              caret-color: white;
              padding: 5px;
              width: 350px;
            "
          >
          <input id="passwordSignup" type="password"
            style="
              background-color: transparent !important;
              color: white !important;
              -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
              border: none;
              outline: none;
              color: white;
              font-size: 80px;
              text-align: center;
              caret-color: white;
              padding: 5px;
              width: 350px;
            "
          >
        </div>
      `
      )
      .setOrigin(0.5)
      .setVisible(false);

    // Ensure Phaser uses its internal transform matrix to lock it to canvas
    this.updateDomPosition(this.gameWidth, this.gameHeight);

    // Keep DOM element in sync with game size
    this.resizeListener = (gameSize) => {
      const width = gameSize.width;
      const height = gameSize.height;

      this.updateDomPosition(width, height);

      // Resize background
      this.bg.displayWidth = width;
      this.bg.displayHeight = height;

      // Adjust buttons
      this.signupBtn.setPosition(
        width - this.horizontalButtonOffset,
        height - this.verticalButtonOffset
      );
      this.backBtn.setPosition(
        this.horizontalButtonOffset,
        height - this.verticalButtonOffset
      );
    };

    // Attach the listener
    scene.scale.on("resize", this.resizeListener);

    this.close();
  }

  // Lock DOM element size & position relative to canvas
  updateDomPosition(width, height) {
    const offsetY = -30;
    this.signupForm.setPosition(width / 2, height / 2 + offsetY);

    // Size as a % of canvas
    const style = this.signupForm.node.style;
    style.width = Math.floor(width * 0.25) + "px";
    style.height = "auto"; // let input adjust
    style.pointerEvents = "auto";
    this.signupForm.updateSize();
  }

  static preload(scene) {
    scene.load.image("signupBg", "./assets/ui/loginUI/bg.png");
    scene.load.image("signupBackButton", "./assets/ui/loginUI/backButton.png");
    scene.load.image("signupButton", "./assets/ui/loginUI/signupButton.png");
  }

  open() {
    this.bg.setVisible(true);
    this.signupBtn.setVisible(true);
    this.backBtn.setVisible(true);
    this.signupForm.setVisible(true);

    // Keep DOM element in sync with game size
    this.resizeListener = (gameSize) => {
      const width = gameSize.width;
      const height = gameSize.height;

      this.updateDomPosition(width, height);

      // Resize background
      this.bg.displayWidth = width;
      this.bg.displayHeight = height;

      // Adjust buttons
      this.signupBtn.setPosition(
        width - this.horizontalButtonOffset,
        height - this.verticalButtonOffset
      );
      this.backBtn.setPosition(
        horizontalButtonOffset,
        height - this.verticalButtonOffset
      );
    };

    // Attach the listener
    this.scene.scale.on("resize", this.resizeListener);
  }

  close() {
    this.bg.setVisible(false);
    this.signupBtn.setVisible(false);
    this.backBtn.setVisible(false);
    this.signupForm.setVisible(false);

    if (this.resizeListener) {
      this.scene.scale.off("resize", this.resizeListener);
      this.resizeListener = null; // optional, clean up reference
    }
  }

  handleSignup() {
    const username = this.signupForm
      .getChildByID("usernameSignup")
      .value.trim();
    const password = this.signupForm
      .getChildByID("passwordSignup")
      .value.trim();

    if (!username || !password) {
      return alert("Both fields required");
    }

    // Show animated "Creating Account..." popup
    this.showCreatingAccountPopup();

    try {
      // Don't use the callback version anymore
      socket.emit("signup", { username, password });
    } catch (err) {
      this.hideCreatingAccountPopup();
      socket.emit("clientError", { message: err.message, stack: err.stack });
    }
  }

  // Popup methods
  showCreatingAccountPopup() {
    if (!this.creatingPopup) {
      this.creatingPopup = this.scene.add
        .text(
          this.gameWidth / 2,
          this.gameHeight / 2 - 150,
          "Creating Account...",
          {
            font: "60px Arial",
            fill: "#ffffff",
          }
        )
        .setOrigin(0.5)
        .setAlpha(0);

      // Simple fade-in + pulsing animation
      this.scene.tweens.add({
        targets: this.creatingPopup,
        alpha: 1,
        yoyo: true,
        repeat: -1,
        duration: 800,
      });
    } else {
      this.creatingPopup.setVisible(true);
    }
  }

  hideCreatingAccountPopup() {
    if (this.creatingPopup) {
      this.creatingPopup.setVisible(false);
      this.scene.tweens.killTweensOf(this.creatingPopup);
    }
  }
  destroy() {
    // Remove resize listener
    if (this.resizeListener) {
      this.scene.scale.off("resize", this.resizeListener);
      this.resizeListener = null;
    }

    // Remove interactive events
    this.signupBtn.removeAllListeners();
    this.backBtn.removeAllListeners();

    // Destroy Phaser objects
    this.bg.destroy();
    this.signupBtn.destroy();
    this.backBtn.destroy();
    this.signupForm.destroy();
  }
}
