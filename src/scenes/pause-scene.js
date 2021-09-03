import BaseScene from './base-scene';
import { scenesName } from './constance';

class PauseScene extends BaseScene {
  constructor(config) {
    super(scenesName.PAUSE_SCENE, config)
    this.menus = [
      { text: 'continue', scene: scenesName.PLAY_SCENE },
      { text: 'Exit', scene: scenesName.MENU_SCENE },
    ]
  }

  create() {
    super.create()
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
      if (menuItem.text === 'continue') {
        this.scene.stop()
        this.scene.resume(menuItem.scene)
      } else {
        this.scene.stop(scenesName.PLAY_SCENE)
        this.scene.start(scenesName.MENU_SCENE)
      }
    })
  }

  update() {

  }
}

export default PauseScene;