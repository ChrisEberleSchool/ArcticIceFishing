//locomotion
const ANIM_IDLE_FRAMERATE = 4;
const ANIM_WALK_FRAMERATE = 12;
// fishing
const ANIM_FISHING_IDLE_FRAMERATE = 2;
const ANIM_FISHING_FIGHT_FRAMERATE = 6;

export default class PlayerSprite {
  constructor(scene, x, y) {
    this.scene = scene;
    this.sprite = scene.physics.add
      .sprite(x, y, "playerIdleSheet")
      .setOrigin(0.5)
      .setScale(0.8);

    this.sprite.play("idle-down");
  }

  static preload(scene) {
    scene.load.spritesheet(
      "playerIdleSheet",
      "./assets/Game/Player/playerSprites/standard/idle.png",
      {
        frameWidth: 64,
        frameHeight: 64,
      }
    );

    scene.load.spritesheet(
      "playerWalkSheet",
      "./assets/Game/Player/playerSprites/standard/walk.png",
      {
        frameWidth: 64,
        frameHeight: 64,
      }
    );

    scene.load.spritesheet(
      "playerFishingSheet",
      "./assets/Game/Player/playerSprites/custom/tool_rod.png",
      {
        frameWidth: 128,
        frameHeight: 128,
      }
    );
  }

  static createAnimations(scene) {
    // IDLE ANIMS
    scene.anims.create({
      key: "idle-up",
      frames: scene.anims.generateFrameNumbers("playerIdleSheet", {
        frames: [0, 1],
      }),
      frameRate: ANIM_IDLE_FRAMERATE,
      repeat: -1,
    });

    scene.anims.create({
      key: "idle-left",
      frames: scene.anims.generateFrameNumbers("playerIdleSheet", {
        frames: [2, 3],
      }),
      frameRate: ANIM_IDLE_FRAMERATE,
      repeat: -1,
    });

    scene.anims.create({
      key: "idle-down",
      frames: scene.anims.generateFrameNumbers("playerIdleSheet", {
        frames: [4, 5],
      }),
      frameRate: ANIM_IDLE_FRAMERATE,
      repeat: -1,
    });

    scene.anims.create({
      key: "idle-right",
      frames: scene.anims.generateFrameNumbers("playerIdleSheet", {
        frames: [6, 7],
      }),
      frameRate: ANIM_IDLE_FRAMERATE,
      repeat: -1,
    });
    // WALK ANIMS
    scene.anims.create({
      key: "walk-up",
      frames: scene.anims.generateFrameNumbers("playerWalkSheet", {
        frames: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      }),
      frameRate: ANIM_WALK_FRAMERATE,
      repeat: -1,
    });

    scene.anims.create({
      key: "walk-left",
      frames: scene.anims.generateFrameNumbers("playerWalkSheet", {
        frames: [9, 10, 11, 12, 13, 14, 15, 16, 17],
      }),
      frameRate: ANIM_WALK_FRAMERATE,
      repeat: -1,
    });

    scene.anims.create({
      key: "walk-down",
      frames: scene.anims.generateFrameNumbers("playerWalkSheet", {
        frames: [18, 19, 20, 21, 22, 23, 24, 25, 26],
      }),
      frameRate: ANIM_WALK_FRAMERATE,
      repeat: -1,
    });

    scene.anims.create({
      key: "walk-right",
      frames: scene.anims.generateFrameNumbers("playerWalkSheet", {
        frames: [27, 28, 29, 30, 31, 32, 33, 34, 35],
      }),
      frameRate: ANIM_WALK_FRAMERATE,
      repeat: -1,
    });

    // FISH CAST ANIM
    scene.anims.create({
      key: "fishing-cast-right",
      frames: scene.anims.generateFrameNumbers("playerFishingSheet", {
        frames: [42, 43, 44, 45],
      }),
      frameRate: ANIM_FISHING_FIGHT_FRAMERATE,
      repeat: 0,
    });
    // FISHING IDLE ANIM
    scene.anims.create({
      key: "fishing-idle-right",
      frames: scene.anims.generateFrameNumbers("playerFishingSheet", {
        frames: [45, 46],
      }),
      frameRate: ANIM_FISHING_IDLE_FRAMERATE,
      repeat: -1,
    });
    // FISH FIGHT ANIM
    scene.anims.create({
      key: "fishing-fight-right",
      frames: scene.anims.generateFrameNumbers("playerFishingSheet", {
        frames: [46, 47, 48],
      }),
      frameRate: ANIM_FISHING_FIGHT_FRAMERATE,
      repeat: -1,
    });

    scene.anims.create({
      key: "fishing-caught-right",
      frames: scene.anims.generateFrameNumbers("playerFishingSheet", {
        frames: [50, 51],
      }),
      frameRate: ANIM_FISHING_FIGHT_FRAMERATE,
      repeat: -1,
    });
  }

  playAnimation(key) {
    this.sprite.anims.play(key, true);
  }

  destroy() {
    this.sprite.destroy();
  }
}
