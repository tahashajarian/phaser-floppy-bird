import BaseScene from './base-scene';
import { scenesName } from './constance';
import { getMedal } from '../gameplay-utils.mjs';

class ScoreScene extends BaseScene {
    constructor(config) {
        super(scenesName.SCORE_SCENE, config)
    }


    create() {
        super.create()
        this.createPanel(this.centerScreen[0], this.centerScreen[1], 292, 250, .86)
        this.add.text(this.centerScreen[0], this.centerScreen[1] - 86, 'HIGH SCORE', {
            fontFamily: 'Trebuchet MS', fontSize: '16px', fontStyle: 'bold', color: '#ffd166', letterSpacing: 3
        }).setOrigin(.5)
        this.add.text(this.centerScreen[0], this.centerScreen[1] - 18, `${this.bestScore || 0}`, {
            fontFamily: 'Trebuchet MS', fontSize: '64px', fontStyle: 'bold', color: '#ffffff', stroke: '#242442', strokeThickness: 6
        })
            .setOrigin(0.5)
        const medal = getMedal(this.bestScore)
        if (medal) {
            this.add.circle(this.centerScreen[0] - 43, this.centerScreen[1] + 34, 12, medal.color).setStrokeStyle(2, 0xffffff, .35)
            this.add.text(this.centerScreen[0] - 23, this.centerScreen[1] + 34, `${medal.name} FLIGHT`, {
                fontFamily: 'Trebuchet MS', fontSize: '10px', fontStyle: 'bold', color: '#ffffff'
            }).setOrigin(0, .5)
        }
        const backMenu = this.createButton(this.centerScreen[0], this.centerScreen[1] + 76, 'BACK TO MENU', 210)

        this.setUpBack(backMenu)
    }

    setUpBack(menu) {
        menu.setInteractive()
        menu.on('pointerover', () => {
            menu.setScale(1.035)
        })

        menu.on('pointerout', () => {
            menu.setScale(1)
        })

        menu.on('pointerup', () => {
            this.scene.start(scenesName.MENU_SCENE)

        })
    }

    update() {

    }
}

export default ScoreScene;
