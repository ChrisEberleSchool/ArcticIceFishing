import socket from "../../../network/socket.js";

export default class SignupPage {
  constructor(scene) {
    this.scene = scene;
    this.gameWidth = scene.sys.game.config.width;
    this.gameHeight = scene.sys.game.config.height;

    // Buttons
    this.horizontalButtonOffset = 650;
    this.verticalButtonOffset = 100;

    // background
    this.bg = scene.add
      .image(this.gameWidth / 2, this.gameHeight / 2, "signupBg")
      .setDisplaySize(this.gameWidth, this.gameHeight)
      .setVisible(false);

    // form (inputs created in HTML, no .add.input calls!)
    this.signupForm = scene.add
      .dom(this.gameWidth / 2, this.gameHeight / 2)
      .createFromHTML(
        `
        <div style="display:flex; flex-direction:column; gap:200px; align-items:center;">
          <input id="usernameSignup" 
                 style="
                  background-color: transparent !important;
                  color: white !important;
                  -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
                  border: none;
                  outline: none;
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

    // buttons
    this.signupBtn = scene.add
      .image(
        this.gameWidth - this.horizontalButtonOffset,
        this.gameHeight - this.verticalButtonOffset,
        "signupButton"
      )
      .setVisible(false)
      .setInteractive({ useHandCursor: true });

    this.backBtn = scene.add
      .image(
        this.horizontalButtonOffset,
        this.gameHeight - this.verticalButtonOffset,
        "signupBackButton"
      )
      .setVisible(false)
      .setInteractive({ useHandCursor: true });

    // popup
    this.creatingPopup = scene.add
      .image(this.gameWidth / 2, this.gameHeight / 2 - 300, "creatingPopup")
      .setVisible(false)
      .setAlpha(0);

    // inside constructor after creating this.signupForm
    this.updateDomPosition(this.gameWidth, this.gameHeight);

    // store listener
    this.resizeListener = (gameSize) => {
      const width = gameSize.width;
      const height = gameSize.height;

      this.updateDomPosition(width, height);

      this.bg.setDisplaySize(width, height).setPosition(width / 2, height / 2);
      this.creatingPopup.setPosition(width / 2, height / 2 - 300);

      this.signupBtn.setPosition(
        width - this.horizontalButtonOffset,
        height - this.verticalButtonOffset
      );
      this.backBtn.setPosition(
        this.horizontalButtonOffset,
        height - this.verticalButtonOffset
      );
    };

    // socket events
    socket.off("signupSuccess");
    socket.off("signupError");

    socket.on("signupSuccess", (data) => {
      console.log("✅ Signup success:", data);
      this.hideCreatingAccountPopup();
      this.close();
      this.scene.showPlayPage(); // or showLoginPage() if you want that flow
    });

    socket.on("signupError", (msg) => {
      console.log("❌ Signup failed:", msg);
      this.hideCreatingAccountPopup();
      this.showErrorPopup(msg);
    });
  }

  // add helper just like in LoginPage
  updateDomPosition(width, height) {
    const offsetY = -30; // keep consistent with login
    this.signupForm.setPosition(width / 2, height / 2 + offsetY);

    const style = this.signupForm.node.style;
    style.width = Math.floor(width * 0.25) + "px";
    style.height = "auto";
    style.pointerEvents = "auto";

    this.signupForm.updateSize();
  }

  static preload(scene) {
    scene.load.image("signupBg", "./assets/Game/Menu/loginUI/bg.png");
    scene.load.image(
      "signupBackButton",
      "./assets/Game/Menu/loginUI/backButton.png"
    );
    scene.load.image(
      "signupButton",
      "./assets/Game/Menu/loginUI/signupButton.png"
    );
  }

  open() {
    this.bg.setVisible(true);
    this.signupForm.setVisible(true);
    this.signupBtn.setVisible(true);
    this.backBtn.setVisible(true);

    this.scene.scale.on("resize", this.resizeListener);

    this.signupBtn.once("pointerdown", () => {
      const username = this.signupForm.getChildByID("usernameSignup").value;
      const password = this.signupForm.getChildByID("passwordSignup").value;

      if (!username || !password) return;

      this.showCreatingAccountPopup();
      socket.emit("signup", { username, password });

      this.signupForm.getChildByID("usernameSignup").blur();
      this.signupForm.getChildByID("passwordSignup").blur();
    });

    this.backBtn.once("pointerdown", () => {
      this.close();
      this.scene.showLoginSignupPage();
    });
  }

  close() {
    this.bg.setVisible(false);
    this.signupForm.setVisible(false);
    this.signupBtn.setVisible(false).removeAllListeners();
    this.backBtn.setVisible(false).removeAllListeners();

    this.scene.scale.off("resize", this.resizeListener);
  }

  showCreatingAccountPopup() {
    this.creatingPopup.setVisible(true).setAlpha(0);
    this.scene.tweens.add({
      targets: this.creatingPopup,
      alpha: 1,
      duration: 300,
      ease: "Power2",
    });
  }

  hideCreatingAccountPopup() {
    this.scene.tweens.killTweensOf(this.creatingPopup);
    this.scene.tweens.add({
      targets: this.creatingPopup,
      alpha: 0,
      duration: 300,
      onComplete: () => this.creatingPopup.setVisible(false),
    });
  }

  showErrorPopup(msg) {
    this.errorPopup?.destroy();

    this.errorPopup = this.scene.add
      .text(this.gameWidth / 2, this.gameHeight / 2 - 200, msg, {
        font: "50px Arial",
        fill: "#ff4444",
        backgroundColor: "#000000aa",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5);

    this.scene.time.delayedCall(3000, () => {
      this.errorPopup?.destroy();
      this.errorPopup = null;
    });
  }
}
