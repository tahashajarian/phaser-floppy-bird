import Phaser from 'phaser';

class PlayScene extends Phaser.Scene {
    constructor(config) {
        super('PlayScene')
        this.config = config;
        this.birdJumpVelocity = -250
    }
    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('bird', 'assets/bird.png');
        this.load.image('pipe', 'assets/pipe.png');
    }
    create() {
        this.add.image(0, 0, 'sky').setOrigin(0);

        this.bird = this.physics.add.sprite(this.config.birdInitialPosition.x, this.config.birdInitialPosition.y, 'bird')
        this.bird.setCollideWorldBounds(true);
        this.bird.body.gravity.y = 400
        this.bird.body.onWorldBounds = true
        this.physics.world.on('worldbounds', (body, up, down, left, right) => {
            if (down || up) {
                this.restart();
            }
        });

        this.input.on('pointerdown', this.flap.bind(this))
        this.input.keyboard.on('keydown_SPACE', this.flap, this)
        this.input.keyboard.on('keydown_UP', this.flap, this)

        this.pipes = this.physics.add.group();
        for (let i = 0; i < 3; i++) {
            const pipeTop = this.pipes.create(0, 0, 'pipe').setOrigin(0, 1)
            const pipeBottom = this.pipes.create(0, 0, 'pipe').setOrigin(0, 0)
            this.placePipe(pipeTop, pipeBottom)
        }
        this.pipes.setVelocity(-200, 0)

    }

    update() {
        this.recyclePipe()
    }

    recyclePipe() {
        const arrayPipes = this.pipes.getChildren();
        const passedPipe = []
        arrayPipes.forEach(pipe => {
            // console.log(pipe)
            if (pipe.getBounds().right < 0) {
                passedPipe.push(pipe)
                if (passedPipe.length === 2) {
                    this.placePipe(...passedPipe)
                }
            }
        })
    }

    flap(e) {
        this.bird.body.velocity.y += this.birdJumpVelocity
    }

    restart() {
        console.log('game over')
        this.bird.body.velocity.y = 0
        this.bird.x = this.config.birdInitialPosition.x
        this.bird.y = this.config.birdInitialPosition.y
    }

    placePipe(uPipe, bPipe) {
        const pipeHorizontalDistance = this.getRightLastPipe() + Phaser.Math.Between(400, 600)
        const pipeVerticalDistance = 150;
        const pipePositionRange = Phaser.Math.Between(20, this.config.height - 20 - pipeVerticalDistance)
        uPipe.x = pipeHorizontalDistance
        uPipe.y = pipePositionRange
        bPipe.x = uPipe.x
        bPipe.y = uPipe.y + pipeVerticalDistance
    }

    getRightLastPipe() {
        let rightLastPipe = 0
        const arrayPipes = this.pipes.getChildren();
        arrayPipes.forEach((pipe) => {
            rightLastPipe = pipe.x > rightLastPipe ? pipe.x : rightLastPipe
        });
        return rightLastPipe
    }
}

export default PlayScene;