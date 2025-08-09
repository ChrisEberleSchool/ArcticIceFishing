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
    weightRange, // [minWeight, maxWeight]
    baseFishSpeed,
    rewardPerKg,
    allowedEquipment,
    basePullFrequency, // pulls per second at minimum size
    basePullSpeed, // pull force/speed at minimum size
    tier = "common",
  }) {
    this.name = name;
    this.spriteKey = spriteKey;
    this.spritePath = spritePath;
    this.lengthRange = lengthRange;
    this.weightRange = weightRange;
    this.baseFishSpeed = baseFishSpeed;
    this.rewardPerKg = rewardPerKg;
    this.allowedEquipment = allowedEquipment;
    this.basePullFrequency = basePullFrequency;
    this.basePullSpeed = basePullSpeed;

    // Will be generated at runtime
    this.length = null;
    this.weight = null;
    this.fishSpeed = null;
    this.reward = null;
    this.pullFrequency = null;
    this.pullSpeed = null;
    this.sprite = null;
    this.tier = tier;
  }

  static preload(scene) {
    throw new Error("Subclasses must implement preload()");
  }

  // Randomize size & difficulty when caught
  generateStats() {
    const [minLength, maxLength] = this.lengthRange;
    const [minWeight, maxWeight] = this.weightRange;

    // Pick a random length
    this.length = Phaser.Math.FloatBetween(minLength, maxLength);

    // Scale weight proportionally to length
    const lengthRatio = (this.length - minLength) / (maxLength - minLength);
    this.weight = minWeight + lengthRatio * (maxWeight - minWeight);

    // Scale difficulty based on size
    const sizeFactor = this.weight / maxWeight;

    // Movement speed
    this.fishSpeed = this.baseFishSpeed + sizeFactor * 0.5;

    // Pull behavior
    this.pullFrequency = this.basePullFrequency + sizeFactor * 1.0; // more often when bigger
    this.pullSpeed = this.basePullSpeed + sizeFactor * 2.0; // harder pulls when bigger

    // Calculate reward
    this.reward = Math.floor(
      this.weight * this.rewardPerKg * (TIER_MULTIPLIERS[this.tier] || 1)
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
