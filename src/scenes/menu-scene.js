import BaseScene from './base-scene';
import { scenesName } from './constance';

class MenuScene extends BaseScene {
  constructor(config) {
    super(scenesName.MENU_SCENE, config)
    this.menus = [
      { text: 'START FLIGHT', scene: scenesName.PLAY_SCENE },
      { text: 'HIGH SCORE', scene: scenesName.SCORE_SCENE },
    ]
  }

  create() {
    super.create()
    this.add.text(this.centerScreen[0], this.centerScreen[1] - 174, 'FLAPPY BIRD', {
      fontFamily: 'Trebuchet MS', fontSize: `${Math.min(64, this.config.width * .13)}px`,
      fontStyle: 'bold', color: '#ffffff', stroke: '#242442', strokeThickness: 8
    }).setOrigin(.5);
    this.add.text(this.centerScreen[0], this.centerScreen[1] - 116, 'ARCADE CLASSIC', {
      fontFamily: 'Trebuchet MS', fontSize: '13px', fontStyle: 'bold', color: '#ffd166', letterSpacing: 4
    }).setOrigin(.5);
    this.createPanel(this.centerScreen[0], this.centerScreen[1] + 38, 282, 162, .7);
    this.add.sprite(this.centerScreen[0] - 104, this.centerScreen[1] - 170, 'bird', 10).setScale(3).setFlipX(true).setAngle(-8);
    this.createMenus(this.menus)
    this.add.text(this.centerScreen[0], this.config.height - 34, 'SPACE / CLICK TO FLAP   •   ↑↓ + ENTER TO SELECT', {
      fontFamily: 'Trebuchet MS', fontSize: '12px', fontStyle: 'bold', color: '#ffffff'
    }).setOrigin(.5).setAlpha(.55);
  }



  setUpMenuEvent(menuItem) {
    const textGO = menuItem.textGO;
    textGO.on('pointerup', () => {
      this.scene.start(menuItem.scene)
    })
  }

  update() {

  }
}

export default MenuScene;
