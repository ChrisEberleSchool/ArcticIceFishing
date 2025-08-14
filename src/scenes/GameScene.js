import Phaser from "phaser";
import socket from "../network/socket.js";
import Player from "../objects/Player/Player.js";
import RemotePlayer from "../objects/Player/RemotePlayer.js";
import registerPlayerEvents from "../objects/Player/PlayerEvents.js";
import WorldGrid from "../objects/Map/WorldGrid.js";
import InputManager from "../objects/InputManager.js";
import sizes from "../config/gameConfig.js";
import Leaderboard from "../objects/Leaderboard/Leaderboard.js";

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
    Player.preload(this);
    console.log("GAME SCENE STARTED");
  }

  create(data) {
    const username = data?.username;
    if (!username) {
      console.error("Missing username, cannot initialize player.");
      // Instead of returning early, you could pause the scene so nothing runs:
      this.scene.pause();
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
      this.socket,
      0,
      0
    );

    this.socket.on("currentPlayers", (players) => {
      const playerData = Object.values(players).find(
        (p) => p.username === username
      );
      if (playerData && this.localPlayer) {
        this.localPlayer.setPosition(playerData.x, playerData.y);
        this.localPlayer.coins = playerData.coins;
        this.localPlayer.fishCaught = playerData.fishCaught;
        this.scene
          .get("scene-ui")
          .coinUI.updateCoinText(this.localPlayer.coins);
      }
    });

    this.inputManager = new InputManager(this, this.localPlayer);

    registerPlayerEvents(this, this.socket); // should internally use RemotePlayer

    this.socket.emit("initPlayer", { username });

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

    // leaderboard
    this.leaderboard = new Leaderboard(this, 280, 10);
    socket.emit("requestLeaderboard");

    socket.on("leaderboardData", (data) => {
      this.leaderboard.updateLeaderboard(data);
    });

    // Optional: refresh every 30s or so
    this.time.addEvent({
      delay: 30000,
      callback: () => socket.emit("requestLeaderboard"),
      loop: true,
    });

    // Listen for GameBar exit from UIScene
    this.events.on("gameBarExit", () => {
      if (this.localPlayer && this.localPlayer.fishing) {
        this.localPlayer.stopFishing();
        console.log("Player stopped fishing due to GameBar exit.");
      }
    });
  }

  shutdown() {
    this.inputManager.destroy();
  }

  lastMovementEmit = 0; // timestamp of last emit

  update() {
    if (!this.localPlayer) return;

    this.localPlayer.update();

    this.socket.emit("playerMovement", {
      x: this.localPlayer.x,
      y: this.localPlayer.y,
      fishing: this.localPlayer.fishing,
      fishingState: this.localPlayer.fishingState,
      facing: this.localPlayer.facing,
      isMoving: this.localPlayer.isMoving,
    });

    const now = performance.now();
    if (now - this.lastMovementEmit > 100) {
      // 100ms interval
      this.socket.emit("playerStats", {
        coins: this.localPlayer.coins,
        fishCaught: this.localPlayer.fishCaught,
      });
      this.lastMovementEmit = now;
    }

    // Update remote players
    for (const id in this.players) {
      this.players[id].update();
    }
  }
}
