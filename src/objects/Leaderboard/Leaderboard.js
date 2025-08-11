import Phaser from "phaser";

export default class Leaderboard {
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;

    this.container = this.scene.add.container(x, y);

    // Title
    this.title = this.scene.add.text(0, 0, "Leaderboard - Biggest Fish", {
      fontFamily: "'Orbitron', monospace",
      fontSize: "16px",
      color: "#00ffff",
      stroke: "#003344",
      strokeThickness: 3,
    });
    this.container.add(this.title);

    // Array for player entries (text objects)
    this.entries = [];
    for (let i = 0; i < 10; i++) {
      const entryText = this.scene.add.text(0, 24 + i * 20, "", {
        fontFamily: "'Orbitron', monospace",
        fontSize: "14px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 2,
      });
      this.container.add(entryText);
      this.entries.push(entryText);
    }
  }

  // Call this to update leaderboard display with new data
  updateLeaderboard(data) {
    for (let i = 0; i < 10; i++) {
      if (data[i]) {
        const { username, tier, fishName, length, caughtAt } = data[i];
        const dateStr = new Date(caughtAt).toLocaleDateString();
        this.entries[i].setText(
          `${i + 1}. ${username} - [${tier}] ${fishName} - ${length.toFixed(
            2
          )}in - ${dateStr}`
        );
      } else {
        this.entries[i].setText("");
      }
    }
  }

  // Optionally, you can add a method to reposition the leaderboard if needed
  setPosition(x, y) {
    this.container.setPosition(x, y);
  }

  destroy() {
    this.container.destroy(true);
  }
}
