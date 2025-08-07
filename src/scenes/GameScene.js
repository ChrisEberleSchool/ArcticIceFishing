import Phaser from "phaser";
import socket from "/network/socket.js";
import Player from "../objects/Player/Player.js";
import RemotePlayer from "../objects/Player/RemotePlayer.js";
import registerPlayerEvents from "../objects/Player/PlayerEvents.js";
import WorldGrid from "../objects/Map/WorldGrid.js";

const TILE_SIZE = 32;
const PLAYER_SPAWN_POINT = { x: 250, y: 250 };

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.players = {}; // remote players
    this.localPlayer = null;
    this.socket = socket;
    this.worldGrid = null;
  }

  preload() {
    this.load.image("tiles", "./assets/mapAssets/spritesheet.png");
    this.load.tilemapTiledJSON("map1", "./assets/mapAssets/map1.json");
    Player.preload(this);

    this.load.image("spenn", "./assets/Spen.png"); // load your PNG file
    this.load.image("dena", "./assets/Dena.png"); // load your PNG file
  }

  create(data) {
    const username = data?.username;
    if (!username) {
      console.error("Missing username, cannot initialize player.");
      return;
    }

    const map = this.make.tilemap({
      key: "map1",
      tileWidth: TILE_SIZE,
      tileHeight: TILE_SIZE,
    });
    const tileset = map.addTilesetImage("tiles1", "tiles");
    map.createLayer("groundLayer", tileset, 0, 0);
    map.createLayer("iceHoleLayer", tileset, 0, 0);
    map.createLayer("buildingLayer", tileset, 0, 0);

    this.worldGrid = new WorldGrid(this, map.width, map.height, TILE_SIZE);

    Player.createAnimations(this);

    this.localPlayer = new Player(
      this,
      PLAYER_SPAWN_POINT.x,
      PLAYER_SPAWN_POINT.y,
      username,
      this.socket
    );

    this.input.mouse.disableContextMenu();
    this.input.addPointer(2);
    this.input.on("pointerdown", (pointer) => {
      if (pointer.pointerType === "mouse" && pointer.rightButtonDown()) return;
      this.localPlayer.moveTo(pointer.worldX, pointer.worldY);
    });

    registerPlayerEvents(this, this.socket); // should internally use RemotePlayer

    this.socket.emit("initPlayer", { username });

    this.fKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

    const x = -20;
    const y = 150;
    const originX = 0.5; // center horizontally
    const originY = 0.5; // center vertically
    const width = 40; // desired width in pixels
    const height = 150; // desired height in pixels

    const myImageSprite = this.add.sprite(x, y, "spenn");
    myImageSprite.setOrigin(originX, originY);
    myImageSprite.setDisplaySize(width, height);
    const myImageSprite1 = this.add.sprite(x, y + 150, "dena");
    myImageSprite1.setOrigin(originX, originY);
    myImageSprite1.setDisplaySize(width, height);
  }

  update() {
    if (!this.localPlayer) return;

    this.localPlayer.update();

    this.socket.emit("playerMovement", {
      x: this.localPlayer.x,
      y: this.localPlayer.y,
      fishing: this.localPlayer.fishing,
      fishingState: this.localPlayer.fishingState,
      facing: this.localPlayer.facing,
    });

    // Update remote players
    for (const id in this.players) {
      this.players[id].update();
    }
  }
}
