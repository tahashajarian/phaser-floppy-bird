import BaseScene from './base-scene';
import { scenesName } from './constance';

class MenuScene extends BaseScene {
  constructor(config) {
    super(scenesName.MENU_SCENE, config)
    this.menus = [
      { text: 'Play', scene: scenesName.PLAY_SCENE },
      { text: 'Scores', scene: scenesName.SCORE_SCENE },
      { text: 'Exit', scene: '' },
    ]
  }

  create() {
    this.add.image(0, 0, 'sky').setOrigin(0);
    // this.scene.start('PlayScene')
    this.createMenus(this.menus)
  }



  setUpMenuEvent(menuItem) {
    const textGO = menuItem.textGO;
    textGO.setInteractive();

    textGO.on('pointerover', () => {
      textGO.setStyle({ fill: '#ff0' })
    })

    textGO.on('pointerout', () => {
      textGO.setStyle({ fill: '#fff' })
    })

    textGO.on('pointerup', () => {
      if (menuItem.scene) {
        this.scene.start(menuItem.scene)
      } else {
        this.game.destroy()
      }
    })
  }

  update() {

  }
}

export default MenuScene;