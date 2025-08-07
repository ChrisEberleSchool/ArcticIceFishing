export default class FishingTileEvents {
  constructor(scene, socket, worldGrid, player) {
    this.scene = scene;
    this.socket = socket;
    this.worldGrid = worldGrid;
    this.player = player;

    // In FishingTileEvents constructor
    this.socket.on("fishingHoleStates", (allFishingHoles) => {
      for (const key in allFishingHoles) {
        const [x, y] = key.split(",").map(Number);
        const tile = this.worldGrid.getFishingTileAt(x, y);
        if (tile) {
          tile.isOccupied = allFishingHoles[key] !== null;
        }
      }
    });

    // Listen for fishing hole occupancy updates from the server
    this.socket.on("fishingHoleUpdate", ({ x, y, occupiedBy }) => {
      const tile = this.worldGrid.getFishingTileAt(x, y);
      if (tile) {
        tile.isOccupied = occupiedBy !== null;
      }
    });

    // Listen for occupation success (only for this player)
    this.socket.on("occupySuccess", ({ x, y }) => {
      this.player.fishing = true;
      this.player.currentFishingTile = { x, y };
      this.player.stopMoving();
    });

    // Listen for occupation failure (only for this player)
    this.socket.on("occupyFailed", ({ x, y }) => {
      // Optional: Show some UI feedback that the hole is occupied
      console.log("Fishing hole is occupied!");
      // You can add code to show interactText message here
      if (this.player.interactText) {
        this.player.interactText.setText("Hole is Occupied");
        this.player.interactText.setVisible(true);
        this.player.interactText.x = this.player.sprite.x;
        this.player.interactText.y =
          this.player.sprite.y + this.player.NameTagOffset;
      }
    });
  }

  tryOccupyFishingTile(worldX, worldY) {
    const { x, y } = this.worldGrid.WorldCoordinatesToGrid(worldX, worldY);
    console.log("Attempting to occupy fishing hole at grid:", x, y);
    this.socket.emit("tryOccupyFishingHole", { x, y });
  }

  releaseFishingTile() {
    if (!this.player.currentFishingTile) return;
    const { x, y } = this.player.currentFishingTile;
    this.socket.emit("releaseFishingHole", { x, y });
    this.player.fishing = false;
    this.player.currentFishingTile = null;
  }
}
