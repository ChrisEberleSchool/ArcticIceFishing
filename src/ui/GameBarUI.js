// src/ui/CoinUI.js
import Phaser from "phaser";
import socket from "../network/socket.js";

export default class GameBarUI {
  constructor(scene, x, y) {
    this.scene = scene;
    this.container = scene.add.container(x, y);
    this.container.setScrollFactor(0);
    this.inputElement = null;
    this.socket = socket;

    const gameWidth = scene.sys.game.config.width;
    const gameHeight = scene.sys.game.config.height;

    this.username = null;

    const gameBar = scene.add
      .image(0, 0, "gameBar")
      .setOrigin(0.5, 0.5)
      .setScale(1.0);

    this.exitButton = scene.add
      .image(0, -125, "exitButton")
      .setInteractive({ useHandCursor: true })
      .setVisible(false)
      .on("pointerover", () => {
        this.exitButton.setTint(0x999999);
      })
      .on("pointerout", () => {
        this.exitButton.clearTint();
      })
      .on("pointerdown", () => {
        console.log("Exit button clicked!");
        this.scene.scene.get("scene-game").events.emit("gameBarExit");
        this.hideExitButton(); // hide after exit
      });
    const sendMessageButton = scene.add
      .image(319, 0, "sendButton")
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => {
        sendMessageButton.setTint(0x999999);
      })
      .on("pointerout", () => {
        sendMessageButton.clearTint();
      })
      .on("pointerdown", () => {
        console.log("Send button clicked!");
        this.handleMessage();
      });

    const tackleBoxButton = scene.add
      .image(438, 0, "tackleBoxButton")
      .setInteractive({ useHandCursor: true })
      .on("pointerover", function () {
        this.setTint(0x999999);
      })
      .on("pointerout", function () {
        this.clearTint();
      })
      .on("pointerdown", () => {
        console.log("Tackle box clicked!");
      });

    const backpackButton = scene.add
      .image(556, 0, "backpackButton")
      .setInteractive({ useHandCursor: true })
      .on("pointerover", function () {
        this.setTint(0x999999);
      })
      .on("pointerout", function () {
        this.clearTint();
      })
      .on("pointerdown", () => {
        console.log("Backpack clicked!");
      });

    const settingsButton = scene.add
      .image(674, 0, "settingsButton")
      .setInteractive({ useHandCursor: true })
      .on("pointerover", function () {
        this.setTint(0x999999);
      })
      .on("pointerout", function () {
        this.clearTint();
      })
      .on("pointerdown", () => {
        console.log("Settings clicked!");
      });

    const fishdexButton = scene.add
      .image(-670, 0, "fishdexButton")
      .setInteractive({ useHandCursor: true })
      .on("pointerover", function () {
        this.setTint(0x999999);
      })
      .on("pointerout", function () {
        this.clearTint();
      })
      .on("pointerdown", () => {
        console.log("Settings clicked!");
      });

    this.container.add([
      gameBar,
      sendMessageButton,
      tackleBoxButton,
      backpackButton,
      settingsButton,
      fishdexButton,
      this.exitButton,
    ]);

    // DOM form (Phaser-managed positioning)
    this.chatField = scene.add
      .dom(gameWidth / 2, gameHeight / 2)
      .createFromHTML(
        `
        <div style="display:flex; flex-direction:column; gap:200px; align-items:center;">
          <input id="chatBar"
            style="
              background: transparent;
              border: none;
              outline: none;
              color: white;
              font-size: 30px;
              text-align: left;
              caret-color: white;
              padding: 5px;
              width: 590px;
            "
          >
        </div>
      `
      )
      .setOrigin(0.5)
      .setVisible(true);

    const input = this.chatField.getChildByID("chatBar");

    // Blur input when clicking outside
    document.addEventListener("pointerdown", (event) => {
      // If the click target is NOT the input itself, remove focus
      if (event.target !== input) {
        input.blur();
      }
    });

    // Send message and unfocus on Enter
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault(); // prevent newline in input
        this.handleMessage();
        input.blur(); // remove focus from chat bar
      }
    });

    // Inside the constructor, after creating chatField
    this.chatLog = scene.add
      .dom(gameWidth - 10, 10)
      .createFromHTML(
        `<div id="chatLog" style="
      width: 300px;
      height: 400px;
      overflow-y: auto;
      background: rgba(0,0,0,0.5);
      color: white;
      font-size: 18px;
      padding: 10px;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      gap: 5px;
    ">
  </div>`
      )
      .setOrigin(1, 0); // top-right
    this.chatLog.setScrollFactor(0);

    // Ensure Phaser uses its internal transform matrix to lock it to canvas
    this.updateDomPosition(gameWidth, gameHeight);

    // Keep DOM element in sync with game size
    scene.scale.on("resize", (gameSize) => {
      const width = gameSize.width;
      const height = gameSize.height;

      this.updateDomPosition(width, height);
      this.chatLog.setPosition(width - 10, 10);
    });
  }

  // Lock DOM element size & position relative to canvas
  updateDomPosition(width, height) {
    const offsetY = 489;
    const offsetX = -10;
    this.chatField.setPosition(width / 2 + offsetX, height / 2 + offsetY);

    // Size as a % of canvas
    const style = this.chatField.node.style;
    style.width = Math.floor(width * 0.25) + "px";
    style.height = "auto"; // let input adjust
    style.pointerEvents = "auto";
    this.chatField.updateSize();
  }

  static preload(scene) {
    scene.load.image("gameBar", "./assets/ui/GameBar/bodyBar.png");
    scene.load.image("sendButton", "./assets/ui/GameBar/sendButton.png");
    scene.load.image(
      "settingsButton",
      "./assets/ui/GameBar/settingsButton.png"
    );
    scene.load.image("tackleBoxButton", "./assets/ui/GameBar/tackleButton.png");
    scene.load.image(
      "backpackButton",
      "./assets/ui/GameBar/backpackButton.png"
    );
    scene.load.image("fishdexButton", "./assets/ui/GameBar/fishdexButton.png");
    scene.load.image("exitButton", "./assets/ui/GameBar/exitButton.png");
  }

  updateCoinText(amount) {
    this.coinText.setText(amount.toString());
  }

  handleMessage() {
    const input = this.chatField.getChildByID("chatBar");
    const message = input.value.trim();

    if (!message) return;

    const username = this.username;
    this.socket.emit("chatMessage", { username, message });
    console.log("sent message");
    input.value = ""; // clear input after sending
  }

  setUsername(username) {
    this.username = username;
  }

  addChatMessage({ username, message }) {
    if (!this.chatLog) return;
    const logNode = this.chatLog.getChildByID("chatLog");
    const msgDiv = document.createElement("div");
    msgDiv.textContent = `${username}: ${message}`;
    logNode.appendChild(msgDiv);
    logNode.scrollTop = logNode.scrollHeight; // auto-scroll to bottom
  }

  showExitButton() {
    if (!this.exitButton) return;
    this.exitButton.setVisible(true);
  }

  hideExitButton() {
    if (!this.exitButton) return;
    this.exitButton.setVisible(false);
  }
}
