export default class FishingTileEvents {
  constructor(scene, socket, worldGrid, player) {
    this.scene = scene;
    this.socket = socket;
    this.worldGrid = worldGrid;
    this.player = player;

    this.currentTileKey = null; // tile we occupy
    this.attemptingTileKey = null; // tile we're trying to occupy

    this.socket.on("fishingHoleStates", (allFishingHoles) => {
      for (const key in allFishingHoles) {
        const [x, y] = key.split(",").map(Number);
        const tile = this.worldGrid.getFishingTileAt(x, y);
        if (tile) tile.isOccupied = allFishingHoles[key] !== null;
      }
    });

    this.socket.on("fishingHoleUpdate", ({ x, y, occupiedBy }) => {
      const tile = this.worldGrid.getFishingTileAt(x, y);
      if (tile) tile.isOccupied = occupiedBy !== null;
    });

    this.socket.on("occupySuccess", ({ x, y }) => {
      const key = `${x},${y}`;
      this.currentTileKey = key;
      this.attemptingTileKey = null; // clear in-progress attempt

      const tile = this.worldGrid.getFishingTileAt(x, y);
      if (tile) {
        this.player.currentFishingTile = tile;
        this.player.stopMoving();
        this.player.startFishing(tile);
      }
    });

    this.socket.on("occupyFailed", ({ x, y }) => {
      const key = `${x},${y}`;
      console.log("Fishing hole is occupied!");

      if (this.player.interactText) {
        this.player.interactText.setText("Hole is Occupied");
        this.player.interactText.setVisible(true);
        this.player.interactText.x = this.player.sprite.x;
        this.player.interactText.y =
          this.player.sprite.y + this.player.NameTagOffset;
      }

      if (this.attemptingTileKey === key) this.attemptingTileKey = null;
    });
  }

  tryOccupyFishingTile(worldX, worldY) {
    const { x, y } = this.worldGrid.WorldCoordinatesToGrid(worldX, worldY);
    const key = `${x},${y}`;

    // Only attempt if not already occupying or trying this tile
    if (this.currentTileKey === key || this.attemptingTileKey === key) return;

    console.log("Attempting to occupy fishing hole at grid:", x, y);
    this.attemptingTileKey = key;
    this.socket.emit("tryOccupyFishingHole", { x, y });
  }

  releaseFishingTile() {
    if (!this.currentTileKey) return;

    const [x, y] = this.currentTileKey.split(",").map(Number);
    this.socket.emit("releaseFishingHole", { x, y });

    this.currentTileKey = null;
    this.attemptingTileKey = null;
    this.player.fishing = false;
    this.player.currentFishingTile = null;
  }
}
