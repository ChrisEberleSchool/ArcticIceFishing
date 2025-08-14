import socket from "../../network/socket";

export default class LoginPage {
  constructor(scene) {
    this.scene = scene;

    const gameWidth = scene.sys.game.config.width;
    const gameHeight = scene.sys.game.config.height;

    // Background
    this.bg = scene.add.image(0, 0, "1bg").setOrigin(0).setVisible(false);
    this.bg.displayWidth = gameWidth;
    this.bg.displayHeight = gameHeight;

    // Buttons
    this.horizontalButtonOffset = 650;
    this.verticalButtonOffset = 100;

    this.loginBtn = scene.add
      .image(
        gameWidth - this.horizontalButtonOffset,
        gameHeight - this.verticalButtonOffset,
        "1loginButton"
      )
      .setOrigin(0.5, 0.5)
      .setInteractive({ useHandCursor: true });

    this.loginBtn.on("pointerdown", () => {
      this.handleLogin();
    });

    this.backBtn = scene.add
      .image(
        this.horizontalButtonOffset,
        gameHeight - this.verticalButtonOffset,
        "1backButton"
      )
      .setOrigin(0.5, 0.5)
      .setInteractive({ useHandCursor: true });

    this.backBtn.on("pointerdown", () => {
      this.close();
      this.scene.showLoginSignupPage();
    });

    // DOM form (Phaser-managed positioning)
    this.loginForm = scene.add
      .dom(gameWidth / 2, gameHeight / 2)
      .createFromHTML(
        `
        <div style="display:flex; flex-direction:column; gap:200px; align-items:center;">
          <input id="usernameLogin"
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
          <input id="passwordLogin" type="password"
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

    // Ensure Phaser uses its internal transform matrix to lock it to canvas
    this.updateDomPosition(gameWidth, gameHeight);

    // Store the actual listener function in a variable
    this.resizeListener = (gameSize) => {
      const width = gameSize.width;
      const height = gameSize.height;

      this.updateDomPosition(width, height);

      // Resize background
      this.bg.displayWidth = width;
      this.bg.displayHeight = height;

      // Adjust buttons
      this.loginBtn.setPosition(
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

    socket.on("authSuccess", (data) => {
      this.scene.scene.start("LoadingScene", { username: data.username });
    });

    socket.on("authError", (msg) => {
      alert("Login failed: " + msg);
    });
  }

  static preload(scene) {
    scene.load.image("1bg", "./assets/ui/loginUI/bg.png");
    scene.load.image("1backButton", "./assets/ui/loginUI/backButton.png");
    scene.load.image("1loginButton", "./assets/ui/loginUI/loginButton.png");
  }

  open() {
    this.bg.setVisible(true);
    this.loginBtn.setVisible(true);
    this.backBtn.setVisible(true);
    this.loginForm.setVisible(true);

    // Store the actual listener function in a variable
    this.resizeListener = (gameSize) => {
      const width = gameSize.width;
      const height = gameSize.height;

      this.updateDomPosition(width, height);

      // Resize background
      this.bg.displayWidth = width;
      this.bg.displayHeight = height;

      // Adjust buttons
      this.loginBtn.setPosition(
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
    this.loginBtn.setVisible(false);
    this.backBtn.setVisible(false);
    this.loginForm.setVisible(false);

    // Remove the resize listener
    if (this.resizeListener) {
      this.scene.scale.off("resize", this.resizeListener);
      this.resizeListener = null;
    }
  }

  handleLogin() {
    const username = this.loginForm.getChildByID("usernameLogin").value.trim();
    const password = this.loginForm.getChildByID("passwordLogin").value.trim();
    if (!username || !password) return alert("Both fields required");

    socket.emit("login", { username, password });
  }

  // Lock DOM element size & position relative to canvas
  updateDomPosition(width, height) {
    const offsetY = -30;
    this.loginForm.setPosition(width / 2, height / 2 + offsetY);

    // Size as a % of canvas
    const style = this.loginForm.node.style;
    style.width = Math.floor(width * 0.25) + "px";
    style.height = "auto"; // let input adjust
    style.pointerEvents = "auto";
    this.loginForm.updateSize();
  }

  destroy() {
    // Remove resize listener
    if (this.resizeListener) {
      this.scene.scale.off("resize", this.resizeListener);
      this.resizeListener = null;
    }

    // Remove interactive button events
    this.loginBtn.removeAllListeners();
    this.backBtn.removeAllListeners();

    // Destroy Phaser objects
    this.bg.destroy();
    this.loginBtn.destroy();
    this.backBtn.destroy();
    this.loginForm.destroy();
  }
}
