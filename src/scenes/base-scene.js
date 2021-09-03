import Phaser from 'phaser'
import { BEST_SCORE } from './constance'

class BaseScene extends Phaser.Scene {
  constructor(key, config) {
    super(key)
    this.config = config
    this.centerScreen = [config.width / 2, config.height / 2]
    this.fontStyle = { fontSize: '32px', fill: '#fff' }
    this.bestScore = localStorage.getItem(BEST_SCORE);
    this.lineHeight = 42

  }

  create() {
    this.add.image(0, 0, 'sky').setOrigin(0)
  }


  createMenus(menu) {
    let lastItmeMenuY = 0
    menu.forEach(menuItem => {
      const textPosition = [this.centerScreen[0], this.centerScreen[1] + lastItmeMenuY]
      menuItem.textGO = this.add.text(...textPosition, menuItem.text, this.fontStyle).setOrigin(0.5, 1)
      lastItmeMenuY += this.lineHeight;
      this.setUpMenuEvent(menuItem)
    });
  }

}

export default BaseScene;