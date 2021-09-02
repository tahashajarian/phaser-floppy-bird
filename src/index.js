
import Phaser from "phaser";
import PlayScene from "./scenes/playScene";

const WIDTH = 800;
const HEIGHT = 600;
const birdInitialPosition = { x: WIDTH * 0.1, y: HEIGHT / 2 }

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  birdInitialPosition
}

const config = {
  type: Phaser.AUTO,
  width: SHARED_CONFIG.width,
  height: SHARED_CONFIG.height,
  physics: {
    default: 'arcade',
    arcade: {
      // gravity: { y: 400 },
      debug: true
    }
  },
  scene: [new PlayScene(SHARED_CONFIG)]
};


const Game = new Phaser.Game(config);