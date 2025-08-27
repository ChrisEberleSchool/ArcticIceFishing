import Phaser from "phaser";
import socket from "../../network/socket.js";
import LoginSignupPage from "../ui/startUI/LoginSignupPage.js";
import LoginPage from "../ui/startUI/LoginPage.js";
import SignupPage from "../ui/startUI/SignupPage.js";

export default class AuthScene extends Phaser.Scene {
  constructor() {
    super("scene-auth");
  }

  preload() {}

  create() {
    // instantiate page objects
    this.landingPage = new LoginSignupPage(this);
    this.loginPage = new LoginPage(this);
    this.signupPage = new SignupPage(this);

    this.showLoginSignupPage = () => {
      this.landingPage.open();
    };
    this.showLoginPage = () => {
      this.loginPage.open();
    };

    this.showSignupPage = () => {
      this.signupPage.open();
    };

    // open the landing page first
    this.landingPage.open();

    socket.on("authSuccess", (data) => {
      try {
        this.signupPage?.hideCreatingAccountPopup();
        this.signupPage?.close();
        this.loginPage?.close?.();
        this.landingPage?.close?.();

        document.activeElement?.blur(); // ✅ mobile keyboard hide

        this.scene.start("LoadingScene", { username: data.username });
      } catch (err) {
        console.error("Auth success handler failed:", err);
      }
    });

    socket.on("authError", (msg) => {
      if (this.signupPage?.hideCreatingAccountPopup) {
        this.signupPage.hideCreatingAccountPopup();
      }

      alert("Signup/Login failed: " + msg);
    });

    this.events.on("shutdown", () => {
      this.landingPage?.destroy?.();
      this.loginPage?.destroy?.();
      this.signupPage?.destroy?.();
    });

    // notify boot scene that we're ready
    this.events.emit("ready");
  }
}
