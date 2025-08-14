import Phaser from "phaser";
import socket from "../network/socket.js";
import LoginSignupPage from "../ui/startUI/LoginSignupPage.js";
import LoginPage from "../ui/startUI/LoginPage.js";
import SignupPage from "../ui/startUI/SignupPage.js";
// import SignupPage if you make one

export default class AuthScene extends Phaser.Scene {
  constructor() {
    super("AuthScene");
  }

  preload() {
    // preload for the landing/login/signup pages
    LoginSignupPage.preload(this);
    LoginPage.preload(this);
    SignupPage.preload(this);
    // SignupPage.preload(this);
  }

  create() {
    // instantiate page objects
    this.landingPage = new LoginSignupPage(this);
    this.loginPage = new LoginPage(this);
    this.signupPage = new SignupPage(this);
    // this.signupPage = new SignupPage(this);

    // define scene methods so page objects can call them

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
      this.scene.scene.start("LoadingScene", { username: data.username });
    });

    socket.on("authError", (msg) => {
      alert("Login failed: " + msg);
    });

    this.events.on("shutdown", () => {
      this.landingPage?.destroy?.();
      this.loginPage?.destroy?.();
      this.signupPage?.destroy?.();
    });
  }
}
