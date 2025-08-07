import Phaser from "phaser";
import socket from "/network/socket.js";
import Player from "../objects/Player/Player.js";
import registerPlayerEvents from "../objects/Player/PlayerEvents.js";
import WorldGrid from "../objects/Map/WorldGrid.js";

const TILE_SIZE = 32;
const PLAYER_SPAWN_POINT = { x: 250, y: 250 };

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");

    this.players = {}; // other players
    this.localPlayer = null;
    this.socket = socket;

    this.worldGrid = null;
  }

  preload() {
    this.load.image("tiles", "./assets/mapAssets/spritesheet.png");
    this.load.tilemapTiledJSON("map1", "./assets/mapAssets/map1.json");

    Player.preload(this); // Load player assets
  }

  create(data) {
    const username = data?.username;
    if (!username) {
      console.error("Missing username, cannot initialize player.");
      return;
    }

    console.log(`GameScene started for user: ${username}`);

    // Create the gameScene map
    const map = this.make.tilemap({
      key: "map1",
      tileWidth: TILE_SIZE,
      tileHeight: TILE_SIZE,
    });
    const tileset = map.addTilesetImage("tiles1", "tiles");
    map.createLayer("groundLayer", tileset, 0, 0);
    map.createLayer("iceHoleLayer", tileset, 0, 0);
    map.createLayer("buildingLayer", tileset, 0, 0);

    // World Grid init
    this.worldGrid = new WorldGrid(this, map.width, map.height, TILE_SIZE);

    Player.createAnimations(this);

    // Create local player instance
    this.localPlayer = new Player(
      this,
      PLAYER_SPAWN_POINT.x,
      PLAYER_SPAWN_POINT.y,
      username,
      this.socket
    );

    // Input setup for movement
    this.input.mouse.disableContextMenu();
    this.input.addPointer(2);
    this.input.on("pointerdown", (pointer) => {
      if (pointer.pointerType === "mouse" && pointer.rightButtonDown()) return;

      this.localPlayer.moveTo(pointer.worldX, pointer.worldY);
    });

    registerPlayerEvents(this, this.socket);

    // Debug log before emitting initPlayer
    console.log("Emitting initPlayer with username:", username);
    this.socket.emit("initPlayer", { username });

    this.fKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
  }

  update() {
    if (!this.localPlayer) return;

    this.localPlayer.update();

    // Emit local player position to server
    this.socket.emit("playerMovement", {
      x: this.localPlayer.x,
      y: this.localPlayer.y,
    });

    // Update other players smoothly
    for (const id in this.players) {
      const { sprite, nameText, target } = this.players[id];
      if (target) {
        sprite.x += (target.x - sprite.x) * 0.1;
        sprite.y += (target.y - sprite.y) * 0.1;
        nameText.x = sprite.x;
        nameText.y = sprite.y - this.localPlayer.NameTagOffset;
      }
    }
  }
}
