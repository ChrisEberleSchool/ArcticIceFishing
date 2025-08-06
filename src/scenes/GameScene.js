import Phaser from "phaser";
import socket from "/network/socket.js";
import Player from "../objects/Player.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");

    this.players = {}; // other players
    this.localPlayer = null;
    this.socket = socket;
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
    if (!username) return console.error("Missing username");

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

    // Create local player
    this.localPlayer = new Player(this, 250, 250, username);

    // Handle click/tap movement
    this.input.addPointer(2);
    this.input.on("pointerdown", (pointer) => {
      // Ignore only actual right mouse clicks
      if (pointer.pointerType === "mouse" && pointer.button === 2) return;

      // Touch or left-click
      this.localPlayer.moveTo(pointer.worldX, pointer.worldY);
    });

    this.setupSocketEvents();
    this.socket.emit("initPlayer", { username });
  }

  update() {
    if (!this.localPlayer) return;

    this.localPlayer.update();

    // Emit movement to server
    this.socket.emit("playerMovement", {
      x: this.localPlayer.x,
      y: this.localPlayer.y,
    });

    // Update other players
    for (const id in this.players) {
      const { sprite, nameText, target } = this.players[id];

      if (target) {
        sprite.x += (target.x - sprite.x) * 0.1;
        sprite.y += (target.y - sprite.y) * 0.1;
        nameText.x = sprite.x;
        nameText.y = sprite.y - 24;
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
        if (id === this.socket.id) continue;
        const info = players[id];
        if (!this.players[id]) {
          this.addOtherPlayer(id, info);
        }
        this.players[id].target = { x: info.x, y: info.y };
      }

      for (const id in this.players) {
        if (!players[id]) {
          this.players[id].sprite.destroy();
          this.players[id].nameText.destroy();
          delete this.players[id];
        }
      }
    });

    this.socket.on("playerDisconnected", (id) => {
      if (this.players[id]) {
        this.players[id].sprite.destroy();
        this.players[id].nameText.destroy();
        delete this.players[id];
      }
    });
  }

  addOtherPlayer(id, info) {
    const sprite = this.add
      .sprite(info.x, info.y, "playerIdleSheet")
      .setScale(2)
      .setOrigin(0.5);
    sprite.play("idle");

    const nameText = this.add
      .text(info.x, info.y - 24, info.username, {
        fontSize: "12px",
        color: "#ffffff",
        fontFamily: "Arial",
        stroke: "#000",
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    this.players[id] = {
      sprite,
      nameText,
      target: { x: info.x, y: info.y },
    };
  }
}
