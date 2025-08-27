import Phaser from "phaser";
import socket from "../../network/socket.js";
import Player from "../system/Player/Local/Player.js";
import registerPlayerEvents from "../system/Player/ClientEvents/PlayerEvents.js";
import WorldGrid from "../system/World/WorldGrid.js";
import InputManager from "../Input/InputManager.js";
import Leaderboard from "../system/Leaderboard/Leaderboard.js";

const TILE_SIZE = 32;
const PLAYER_SPAWN_POINT = { x: 250, y: 250 };

export default class GameScene extends Phaser.Scene {
  static instance = null;
  constructor() {
    super("scene-game");
    this.players = {}; // remote players
    this.localPlayer = null;
    this.socket = socket;
    this.worldGrid = null;
    this.leaderboard = null;
  }

  preload() {}

  create(data) {
    GameScene.instance = this;
    const username = data?.username;
    if (!username) {
      console.error("Missing username, cannot initialize player.");
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
        this.localPlayer.playerSprite.sprite.setPosition(
          playerData.x,
          playerData.y
        );
        this.localPlayer.playerData.coins = playerData.coins;
        this.localPlayer.playerData.fishCaught = playerData.fishCaught;

        // Safe coinUI update
        const uiScene = this.scene.get("scene-ui");
        if (uiScene?.coinUI) {
          uiScene.coinUI.updateCoinText(this.localPlayer.playerData.coins);
        }
      }
    });

    this.inputManager = new InputManager(this, this.localPlayer);

    registerPlayerEvents(this, this.socket); // should internally use RemotePlayer

    this.socket.emit("initPlayer", { username });

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
      if (this.localPlayer && this.localPlayer.playerState.fishing) {
        this.localPlayer.fishingController.stopFishing();
        console.log("Player stopped fishing due to GameBar exit.");
      }
    });

    // Emit "ready" so LoadingScene knows UI is fully loaded
    this.events.emit("ready");
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
      fishing: this.localPlayer.playerState.fishing,
      fishingState: this.localPlayer.fishingController.getFishingState(),
      facing: this.localPlayer.playerState.facing,
      isMoving: this.localPlayer.playerState.isMoving,
    });

    const now = performance.now();
    if (now - this.lastMovementEmit > 100) {
      // 100ms interval
      this.socket.emit("playerStats", {
        coins: this.localPlayer.playerData.coins,
        fishCaught: this.localPlayer.playerData.fishCaught,
      });
      this.lastMovementEmit = now;
    }

    // Update remote players
    for (const id in this.players) {
      this.players[id].update();
    }
  }
}
