import BaseScene from "./base-scene";
import { scenesName } from "./constance";

class PreloadScene extends BaseScene {
  constructor(config) {
    super(scenesName.PRELOAD_SCENE, config);
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.spritesheet("bird", "assets/birdSprite2.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.image("pipe", "assets/pipe.png");
    this.load.image("pause", "assets/pause.png");
    this.load.image("back", "assets/back.png");
    this.load.image("cloud", "assets/cloud2.png");
    this.load.image("mountain", "assets/moun.png");
    this.load.image("ground", "assets/ground2.png");
  }

  create() {
    this.scene.start(scenesName.MENU_SCENE);
  }

  update() {}
}

export default PreloadScene;
