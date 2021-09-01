
import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      // gravity: { y: 200 }
      debug: true
    }
  },
  scene: {
    render,
    preload,
    create,
    update,
  }
};
const VELOCITY = 250
const Game = new Phaser.Game(config);

function preload() {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('bird', 'assets/bird.png')
}

function create() {
  const bgImage = this.add.image(0, 0, 'sky');
  bgImage.setOrigin(0)
  this.bird = this.physics.add.sprite(Game.config.width * 0.1, Game.config.height / 2, 'bird')
  // this.bird.body.gravity.x = 100
  // bird.setOrigin(0)

  this.bird.body.velocity.x = VELOCITY
  this.bird.body.velocity.y = VELOCITY
}

function update(time, delta) {
  // console.log(delta)
  // this.bird.body.gravity.x -= 3
  // console.log(this.bird)
  if (this.bird.x >= config.width - this.bird.width / 2) {
    this.bird.body.velocity.x = -VELOCITY
  }
  if (this.bird.x - this.bird.width / 2 <= 0) {
    this.bird.body.velocity.x = VELOCITY
  }
  if (this.bird.y >= config.height - this.bird.height / 2) {
    this.bird.body.velocity.y = -VELOCITY
  }
  if (this.bird.y - this.bird.height / 2 <= 0) {
    this.bird.body.velocity.y = VELOCITY
  }
}

function render() {
  console.log('render runned')
}