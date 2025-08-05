import Phaser from "phaser";
import socket from "/network/socket.js"; // assuming this exports an already-connected socket

const speedDown = 300;

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");

    this.players = {};
    this.localPlayer = null;
    this.socket = socket;
    this.playerSpeed = speedDown + 50;
  }

  preload() {
    this.load.image("tiles", "./assets/spritesheet.png");
    this.load.tilemapTiledJSON("map1", "./assets/map1.json");

    this.load.spritesheet(
      "playerIdleSheet",
      "./assets/basePlayer/16x16IdleSheet.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      }
    );
  }

  create() {
    const map = this.make.tilemap({
      key: "map1",
      tileWidth: 32,
      tileHeight: 32,
    });
    const tileset = map.addTilesetImage("tiles1", "tiles");
    map.createLayer("groundLayer", tileset, 0, 0);
    map.createLayer("iceHoleLayer", tileset, 0, 0);
    map.createLayer("buildingLayer", tileset, 0, 0);

    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("playerIdleSheet", {
        frames: [0, 1],
      }),
      frameRate: 4,
      repeat: -1,
    });

    this.localPlayer = this.physics.add
      .sprite(250, 250, "playerIdleSheet")
      .setOrigin(0.5, 0.5);
    this.localPlayer.setScale(2);
    this.localPlayer.play("idle");

    this.cameras.main.startFollow(this.localPlayer);
    this.cameras.main.roundPixels = true;

    this.cursor = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    // ✅ Setup socket *after* assets are ready
    this.setupSocketEvents();
  }

  update() {
    if (!this.localPlayer) return;

    const { left, right, up, down } = this.cursor;
    const speed = this.playerSpeed;

    let vx = 0;
    let vy = 0;

    if (left.isDown) vx = -speed;
    else if (right.isDown) vx = speed;

    if (up.isDown) vy = -speed;
    else if (down.isDown) vy = speed;

    this.localPlayer.setVelocity(vx, vy);

    // 🛰 Emit position update
    this.socket.emit("playerMovement", {
      x: this.localPlayer.x,
      y: this.localPlayer.y,
    });
  }

  setupSocketEvents() {
    this.socket.on("currentPlayers", (players) => {
      for (const id in players) {
        if (id !== this.socket.id) {
          this.addOtherPlayer(id, players[id]);
        }
      }
    });

    this.socket.on("newPlayer", (playerInfo) => {
      this.addOtherPlayer(playerInfo.id, playerInfo);
    });

    this.socket.on("playerMoved", (playerInfo) => {
      const player = this.players[playerInfo.id];
      if (player) {
        player.setPosition(playerInfo.x, playerInfo.y);
      }
    });

    this.socket.on("playerDisconnected", (id) => {
      if (this.players[id]) {
        this.players[id].destroy();
        delete this.players[id];
      }
    });
  }

  addOtherPlayer(id, info) {
    const other = this.add
      .sprite(info.x, info.y, "playerIdleSheet")
      .setScale(2)
      .setOrigin(0.5, 0.5);
    other.play("idle");
    this.players[id] = other;
  }
}
