import BaseScene from './base-scene';
import { scenesName } from './constance';

class ScoreScene extends BaseScene {
    constructor(config) {
        super(scenesName.SCORE_SCENE, config)
    }


    create() {
        super.create()
        this.add.text(...this.centerScreen, `Best Score: ${this.bestScore}`, this.fontStyle)
            .setOrigin(0.5)
        const backMenu = this.add.image(this.centerScreen[0], this.centerScreen[1] + this.lineHeight + 30, 'back')
            .setOrigin(0.5)
            .setScale(2)

        this.setUpBack(backMenu)
    }

    setUpBack(menu) {
        menu.setInteractive()
        menu.on('pointerover', () => {
            menu.setScale(2.1)
        })

        menu.on('pointerout', () => {
            menu.setScale(2)
        })

        menu.on('pointerup', () => {
            this.scene.start(scenesName.MENU_SCENE)

        })
    }

    update() {

    }
}

export default ScoreScene;