import FishingTile from "./FishingTile";

export default class WorldGrid {
  constructor(scene, width, height, TILE_SIZE) {
    this.scene = scene;
    this.width = width;
    this.height = height;
    this.TILE_SIZE = TILE_SIZE;

    // Define Fishing holes here
    this.fishingTiles = [
      new FishingTile(9, 6),
      new FishingTile(9, 10),
      new FishingTile(9, 14),

      new FishingTile(13, 7),
      new FishingTile(13, 10),
      new FishingTile(13, 13),

      new FishingTile(16, 7),
      new FishingTile(16, 10),
      new FishingTile(16, 13),

      new FishingTile(20, 6),
      new FishingTile(20, 10),
      new FishingTile(20, 14),
    ];

    this.debugGraphics = this.scene.add.graphics();
    this.debugGraphics.setDepth(10010);
    this.debugGraphics.lineStyle(2, 0xff0000, 1);

    //this.DebugDrawFishingHoles();
  }

  DebugDrawFishingHoles() {
    this.debugGraphics.clear();
    this.debugGraphics.lineStyle(2, 0xff0000, 1);

    this.fishingTiles.forEach((tile) => {
      this.debugGraphics.strokeRect(
        tile.GridPos.x * this.TILE_SIZE,
        tile.GridPos.y * this.TILE_SIZE,
        this.TILE_SIZE,
        this.TILE_SIZE
      );
    });
  }

  GridCoordinatesToWorld(x, y) {
    return {
      x: x * this.TILE_SIZE,
      y: y * this.TILE_SIZE,
    };
  }
  WorldCoordinatesToGrid(x, y) {
    return {
      x: Math.floor(x / this.TILE_SIZE),
      y: Math.floor(y / this.TILE_SIZE),
    };
  }

  isOnFishingTile(worldX, worldY) {
    const { x, y } = this.WorldCoordinatesToGrid(worldX, worldY);
    return this.fishingTiles.some(
      (tile) => tile.GridPos.x === x && tile.GridPos.y === y
    );
  }
  getFishingTileAt(gridX, gridY) {
    return this.fishingTiles.find(
      (tile) => tile.GridPos.x === gridX && tile.GridPos.y === gridY
    );
  }
  tryOccupyFishingTile(worldX, worldY) {
    const { x, y } = this.WorldCoordinatesToGrid(worldX, worldY);
    const tile = this.getFishingTileAt(x, y);
    if (tile && !tile.isOccupied) {
      tile.isOccupied = true;
      return true;
    }
    return false;
  }
  releaseFishingTile(worldX, worldY) {
    const { x, y } = this.WorldCoordinatesToGrid(worldX, worldY);
    const tile = this.getFishingTileAt(x, y);
    if (tile) {
      tile.isOccupied = false;
    }
  }
}
