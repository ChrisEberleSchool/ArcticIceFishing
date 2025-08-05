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

  create(data) {
    const username = data?.username;
    if (!username) {
      console.error("Missing username. Game aborted.");
      return;
    }
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
    this.socket.emit("initPlayer", { username });
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

    // Smoothly interpolate other players toward target positions
    for (const id in this.players) {
      if (id === this.socket.id) continue;
      const player = this.players[id];
      if (player.target) {
        player.x += (player.target.x - player.x) * 0.1;
        player.y += (player.target.y - player.y) * 0.1;
      }
    }
  }

  setupSocketEvents() {
    this.socket.on("currentPlayers", (players) => {
      for (const id in players) {
        if (id !== this.socket.id && !this.players[id]) {
          this.addOtherPlayer(id, players[id]);
        }
      }
    });

    this.socket.on("newPlayer", (playerInfo) => {
      if (!this.players[playerInfo.id]) {
        this.addOtherPlayer(playerInfo.id, playerInfo);
      }
    });

    this.socket.on("playersUpdate", (players) => {
      for (const id in players) {
        if (id === this.socket.id) continue; // skip local player
        const info = players[id];
        if (!this.players[id]) {
          this.addOtherPlayer(id, info);
        }
        // Update target position for smooth interpolation
        this.players[id].target = { x: info.x, y: info.y };
      }

      // Remove players no longer on server
      for (const id in this.players) {
        if (!players[id]) {
          this.players[id].destroy();
          delete this.players[id];
        }
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
    other.target = { x: info.x, y: info.y }; // initialize target for smooth movement
    this.players[id] = other;
  }
}
