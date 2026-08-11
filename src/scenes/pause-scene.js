import BaseScene from './base-scene';
import { scenesName } from './constance';

class PauseScene extends BaseScene {
  constructor(config) {
    super(scenesName.PAUSE_SCENE, config)
    this.menus = [
      { text: 'RESUME FLIGHT', scene: scenesName.PLAY_SCENE },
      { text: 'BACK TO MENU', scene: scenesName.MENU_SCENE },
    ]
  }

  create() {
    super.create()
    this.createPanel(this.centerScreen[0], this.centerScreen[1], 292, 230, .9)
    this.add.text(this.centerScreen[0], this.centerScreen[1] - 82, 'PAUSED', {
      fontFamily: 'Trebuchet MS', fontSize: '25px', fontStyle: 'bold', color: '#ffd166'
    }).setOrigin(.5)
    this.createMenus(this.menus)
  }



  setUpMenuEvent(menuItem) {
    const textGO = menuItem.textGO;
    textGO.on('pointerup', () => {
      if (menuItem.scene === scenesName.PLAY_SCENE) {
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
