// Fish.js
const TIER_MULTIPLIERS = {
  common: 1,
  uncommon: 1.5,
  rare: 2.5,
  epic: 4,
  legendary: 8,
};

export default class Fish {
  constructor({
    name,
    spriteKey,
    spritePath,
    lengthRange, // [minLength, maxLength]
    baseFishSpeed,
    rewardPerInch,
    allowedEquipment,
    tugCooldownRange,
    tugDurationRange,
    tier = "common",
  }) {
    this.name = name;
    this.spriteKey = spriteKey;
    this.spritePath = spritePath;
    this.lengthRange = lengthRange;
    this.baseFishSpeed = baseFishSpeed;
    this.rewardPerInch = rewardPerInch;
    this.allowedEquipment = allowedEquipment;
    this.tugCooldownRange = tugCooldownRange;
    this.tugDurationRange = tugDurationRange;

    // Will be generated at runtime
    this.length = null;
    this.weight = null;
    this.fishSpeed = null;
    this.reward = null;
    this.pullFrequency = null;
    this.sprite = null;
    this.tier = tier;
  }

  static preload(scene) {
    throw new Error("Subclasses must implement preload()");
  }

  // Randomize size & difficulty when caught
  generateStats() {
    const [minLength, maxLength] = this.lengthRange;

    // Pick a random length
    this.length = Phaser.Math.FloatBetween(minLength, maxLength);

    // Scale difficulty based on size
    const sizeFactor = this.length / maxLength;

    // Movement speed
    this.fishSpeed = this.baseFishSpeed + sizeFactor * 0.5;

    // Calculate reward
    this.reward = Math.floor(
      this.length * this.rewardPerInch * (TIER_MULTIPLIERS[this.tier] || 1)
    );
  }

  draw(scene, x, y, scale = 0.05) {
    this.sprite = scene.add.sprite(x, y, this.spriteKey).setScale(scale);
    return this.sprite;
  }

  playAnimation(animKey) {
    if (this.sprite) {
      this.sprite.anims.play(animKey, true);
    }
  }

  destroy() {
    if (this.sprite) {
      this.sprite.destroy();
      this.sprite = null;
    }
  }
}
