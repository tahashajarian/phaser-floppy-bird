
import Phaser from "phaser/dist/phaser-arcade-physics";
import PlayScene from "./scenes/play-scene";
import MenuScene from "./scenes/menu-scene";
import PreloadScene from "./scenes/preload-scene";
import ScoreScene from "./scenes/score-scene";
import PauseScene from "./scenes/pause-scene";

const WIDTH = 480;
const HEIGHT = 720;
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
  backgroundColor: '#17172c',
  render: { antialias: false, roundPixels: true },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: WIDTH,
    height: HEIGHT,
  },
  physics: {
    default: 'arcade',
    arcade: {
      // gravity: { y: 400 },
      debug: false
    }
  },
  scene: initScenes()
};


const game = new Phaser.Game(config);

if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
  if (process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  } else {
    // Offline caching during development hides freshly compiled game changes.
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister());
    });
    if ('caches' in window) {
      caches.keys().then((keys) => keys.filter((key) => key.startsWith('flappy-bird-')).forEach((key) => caches.delete(key)));
    }
  }
}

window.addEventListener('beforeunload', () => game.destroy(true));
