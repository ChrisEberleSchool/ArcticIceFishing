import FishingTileEvents from "../../Map/FishingTileEvents.js";
import FishingSession from "../../fishing/FishingSession.js";

export default class PlayerFishingController {
  constructor(player, scene, socket) {
    this.player = player;
    this.scene = scene;
    this.socket = socket;

    this.currentFishingTile = null;
    this.lastFishingTileKey = null;

    // Manage fishing tile occupancy
    this.fishingTileEvents = new FishingTileEvents(
      scene,
      socket,
      scene.worldGrid,
      this.player
    );

    this.fishingSession = null;

    // Request initial fishing tile states from server
    this.socket.emit("requestFishingHoleStates");
  }

  update() {
    // --- Check the tile the player is standing on ---
    const { x: gridX, y: gridY } = this.scene.worldGrid.WorldCoordinatesToGrid(
      this.player.playerSprite.sprite.x,
      this.player.playerSprite.sprite.y
    );
    const fishingTile = this.scene.worldGrid.getFishingTileAt(gridX, gridY);
    const currentTileKey = fishingTile ? `${gridX},${gridY}` : null;

    // --- Try to occupy new tile ---
    if (
      fishingTile &&
      !this.player.playerState.fishing &&
      currentTileKey !== this.lastFishingTileKey
    ) {
      this.fishingTileEvents.tryOccupyFishingTile(
        this.player.playerSprite.sprite.x,
        this.player.playerSprite.sprite.y
      );
      this.lastFishingTileKey = currentTileKey;
    } else if (!fishingTile) {
      this.lastFishingTileKey = null;
    }
  }

  startFishing(fishingTile) {
    if (!fishingTile) return;

    // Create a new session if it doesn't exist
    if (!this.fishingSession) {
      this.fishingSession = new FishingSession(
        this.scene,
        this.player,
        fishingTile
      );
    } else {
      // Reset existing session
      this.fishingSession.stopTimersOnly();
      this.fishingSession.fishingTile = fishingTile;
    }

    this.currentFishingTile = fishingTile;
    this.player.playerState.fishing = true;

    // Position the player on the fishing tile
    const { x, y } = this.scene.worldGrid.GridCoordinatesToWorld(
      fishingTile.GridPos.x,
      fishingTile.GridPos.y
    );
    this.player.playerSprite.sprite.setPosition(x - 18, y - 18);

    // Stop movement
    this.player.playerState.target = null;
    this.player.playerSprite.sprite.setVelocity(0, 0);

    // Start the fishing session
    this.fishingSession.start();

    // Notify other systems (UI, etc.)
    this.scene.events.emit("playerStartedFishing");
  }

  stopFishing() {
    if (!this.player.playerState.fishing) return;

    if (this.fishingSession) {
      this.fishingSession.stopTimersOnly();
    }

    if (this.currentFishingTile) {
      this.fishingTileEvents.releaseFishingTile();
      this.currentFishingTile = null;
    }

    this.player.playerState.fishing = false;
    this.player.playerState.target = null;
    this.player.playerSprite.sprite.setVelocity(0, 0);
    this.fishingSession.state = null;
  }

  // --- Helper: get current fishing state for animations ---
  getFishingState() {
    return this.fishingSession?.state || null;
  }
}
