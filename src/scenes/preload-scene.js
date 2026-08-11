import BaseScene from "./base-scene";
import { scenesName } from "./constance";
import Phaser from "phaser/dist/phaser-arcade-physics";

class PreloadScene extends BaseScene {
  constructor(config) {
    super(scenesName.PRELOAD_SCENE, config);
  }

  preload() {
    const width = this.config.width;
    const height = this.config.height;
    const background = this.add.graphics();
    background.fillGradientStyle(0x17172c, 0x17172c, 0x5454a8, 0x5454a8, 1);
    background.fillRect(0, 0, width, height);
    this.add.text(width / 2, height / 2 - 58, 'FLAPPY BIRD', {
      fontFamily: 'Trebuchet MS', fontSize: '32px', fontStyle: 'bold', color: '#ffffff'
    }).setOrigin(.5);
    const track = this.add.rectangle(width / 2, height / 2, 250, 10, 0x20203c).setOrigin(.5);
    const bar = this.add.rectangle(width / 2 - 125, height / 2, 0, 10, 0xffd166).setOrigin(0, .5);
    const status = this.add.text(width / 2, height / 2 + 28, 'LOADING  0%', {
      fontFamily: 'Trebuchet MS', fontSize: '11px', fontStyle: 'bold', color: '#ffffff'
    }).setOrigin(.5).setAlpha(.65);
    this.load.on('progress', (value) => {
      bar.width = 250 * value;
      status.setText(`LOADING  ${Math.round(value * 100)}%`);
    });
    this.load.spritesheet("bird", "assets/birdSprite2.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.image("pipe", "assets/pipe-cool.png");
    this.load.image("pause", "assets/pause.png");
    this.load.image("back", "assets/back.png");
    this.load.image("cloud", "assets/cloud2.png");
    this.load.image("mountain", "assets/moun.png");
    this.load.image("ground", "assets/ground2.png");
    this.load.audio("death", "assets/death.wav");
  }

  create() {
    // The canvas often scales by a fractional amount on phones and laptops.
    // Linear filtering on this detailed moving texture prevents edge shimmer.
    this.textures.get('pipe').setFilter(Phaser.Textures.FilterMode.LINEAR);
    this.time.delayedCall(180, () => this.scene.start(scenesName.MENU_SCENE));
  }

  update() {}
}

export default PreloadScene;
