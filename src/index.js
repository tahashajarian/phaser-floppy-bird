
import Phaser from "phaser";
import PlayScene from "./scenes/play-scene";
import MenuScene from "./scenes/menu-scene";
import PreloadScene from "./scenes/preload-scene";
import ScoreScene from "./scenes/score-scene";
import PauseScene from "./scenes/pause-scene";

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const birdInitialPosition = { x: WIDTH * 0.1, y: HEIGHT / 2 }

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  birdInitialPosition
}

const scenes = [PreloadScene, MenuScene, PlayScene, ScoreScene, PauseScene]
const initScenes = () => scenes.map((Scene) => new Scene(SHARED_CONFIG))

const config = {
  type: Phaser.AUTO,
  width: SHARED_CONFIG.width,
  height: SHARED_CONFIG.height,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      // gravity: { y: 400 },
      debug: false
    }
  },
  scene: initScenes()
};


const Game = new Phaser.Game(config);