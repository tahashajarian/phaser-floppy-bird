
import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 }
    }
  },
  scene: {
    preload: preload,
    create: create
  }
};

new Phaser.Game(config);

function preload() {
  this.load.image('sky', 'assets/sky.png');
}

function create() {
  const bgImage = this.add.image(0, 0, 'sky');
  bgImage.setOrigin(0)
}
