const TIER_MULTIPLIERS = {
  common: 1,
  uncommon: 1.5,
  rare: 2.5,
  epic: 3,
  legendary: 4,
};

const TIER_TUG_BASES = {
  common: { cooldown: [3000, 4000], duration: [1000, 1500] },
  uncommon: { cooldown: [2500, 3500], duration: [1250, 2000] },
  rare: { cooldown: [1500, 2000], duration: [1000, 2000] },
  legendary: { cooldown: [900, 1600], duration: [600, 1500] },
};

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function computeTugCooldownRange(tier, length, maxLength) {
  const base = TIER_TUG_BASES[tier]?.cooldown || TIER_TUG_BASES.common.cooldown;
  const sizeFactor = length / maxLength;

  return [
    lerp(base[0], base[0] * 0.5, sizeFactor), // cooldown shortens for bigger fish
    lerp(base[1], base[1] * 0.5, sizeFactor),
  ];
}

function computeTugDurationRange(tier, length, maxLength) {
  const base = TIER_TUG_BASES[tier]?.duration || TIER_TUG_BASES.common.duration;
  const sizeFactor = length / maxLength;

  return [
    lerp(base[0], base[0] * 1.5, sizeFactor), // duration lengthens for bigger fish
    lerp(base[1], base[1] * 1.5, sizeFactor),
  ];
}

export default class Fish {
  constructor({
    name,
    spriteKey,
    spritePath,
    lengthRange, // [minLength, maxLength]
    baseFishSpeed,
    rewardPerInch,
    allowedEquipment,
    tier = "common",
  }) {
    this.name = name;
    this.spriteKey = spriteKey;
    this.spritePath = spritePath;
    this.lengthRange = lengthRange;
    this.baseFishSpeed = baseFishSpeed;
    this.rewardPerInch = rewardPerInch;
    this.allowedEquipment = allowedEquipment;
    this.tier = tier;

    // Will be generated at runtime
    this.length = null;
    this.weight = null;
    this.fishSpeed = null;
    this.reward = null;
    this.pullFrequency = null;
    this.sprite = null;

    // tug ranges will be set in generateStats
    this.tugCooldownRange = null;
    this.tugDurationRange = null;
  }

  static preload(scene) {
    throw new Error("Subclasses must implement preload()");
  }

  generateStats() {
    const [minLength, maxLength] = this.lengthRange;

    // Length Calculation
    const rand = Math.random();
    const skew = 2; // tweak this for rarity curve

    const skewedRand = Math.pow(rand, skew); // skew = 2 means skew toward smaller

    this.length = minLength + skewedRand * (maxLength - minLength);

    // Size factor for scaling difficulty
    const sizeFactor = this.length / maxLength;

    // Movement speed scales with size
    this.fishSpeed = this.baseFishSpeed + sizeFactor * 0.5;

    // Calculate reward scaling with tier
    this.reward = Math.floor(
      this.length * this.rewardPerInch * (TIER_MULTIPLIERS[this.tier] || 1)
    );

    // Hard set tug ranges to tier base values — no size scaling
    const base = TIER_TUG_BASES[this.tier] || TIER_TUG_BASES.common;
    this.tugCooldownRange = [...base.cooldown];
    this.tugDurationRange = [...base.duration];
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
