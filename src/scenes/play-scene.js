import BaseScene from './base-scene';
import { scenesName, BEST_SCORE } from './constance';



class PlayScene extends BaseScene {
  constructor(config) {
    super(scenesName.PLAY_SCENE, config)
    this.birdJumpVelocity = -300
  }

  create() {
    super.create()
    this.createBird();
    this.handleInputs();
    this.createPipes();
    this.createPause()
    this.handleCollisWorld()
    this.handleCollisBirdAndPipe()
    this.createScore()
    this.listenToEvents()
    this.createAnims()
  }

  createAnims() {
    this.anims.create({
      key: 'fly',
      frames: this.anims.generateFrameNumbers('bird', { start: 9, end: 15 }),
      frameRate: 32,
      repeat: 1
    })

    this.anims.create({
      key: 'die',
      frames: this.anims.generateFrameNumbers('bird', { start: 16, end: 18 }),
      frameRate: 8,
      // repeat: 0
    })

    this.bird.play('fly')

  }
  createBG() {
    this.add.image(0, 0, 'sky').setOrigin(0);
  }

  createBird() {
    this.bird = this.physics.add.sprite(this.config.birdInitialPosition.x, this.config.birdInitialPosition.y, 'bird')
      .setScale(3)
      .setFlipX(true)
    this.bird.setBodySize(this.bird.width, this.bird.height - 8)
    this.bird.setCollideWorldBounds(true);
    this.bird.body.gravity.y = 600
    this.bird.body.onWorldBounds = true
  }

  createPipes() {
    this.pipes = this.physics.add.group();
    for (let i = 0; i < 3; i++) {
      const pipeTop = this.pipes.create(0, 0, 'pipe').setImmovable(true).setOrigin(0, 1)
      const pipeBottom = this.pipes.create(0, 0, 'pipe').setImmovable(true).setOrigin(0, 0)
      this.placePipe(pipeTop, pipeBottom)
    }
    this.pipes.setVelocity(-200, 0)
  }

  createPause() {
    const pauseButton = this.add.image(this.config.width - 10, this.config.height - 5, 'pause')
      .setInteractive()
      .setOrigin(1)
      .setScale(3)

    pauseButton.on('pointerdown', () => {
      this.pauseGame()
    })
  }

  handleInputs() {
    this.input.on('pointerdown', this.flap.bind(this))
    this.input.keyboard.on('keydown_SPACE', () => this.flap())
    this.input.keyboard.on('keydown_UP', () => this.flap())
    this.input.keyboard.on('keydown_ESC', () => this.pauseGame())
  }

  handleCollisWorld() {
    this.physics.world.on('worldbounds', (body, up, down, left, right) => {
      if (down || up) {
        this.gameOver();
      }
    });
  }

  handleCollisBirdAndPipe() {
    this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this)
  }

  listenToEvents() {
    if (this.eventListener) return
    this.eventListener = this.events.on('resume', () => {
      this.resumeCountDownText = this.add.text(...this.centerScreen, 'Continue in 3', this.fontStyle).setOrigin(0.5)
      this.resumeCountDown = 3
      this.timeEvent = this.time.addEvent({
        delay: 500,
        callback: () => this.countDown(),
        loop: true
      })
    })
  }

  countDown() {
    this.resumeCountDown--;
    this.resumeCountDownText.setText(`Continue in ${this.resumeCountDown}`)
    if (this.resumeCountDown <= 0) {
      this.isPaused = false
      this.timeEvent.remove();
      this.physics.resume();
      this.resumeCountDownText.setText('')
    }
  }

  createScore() {
    this.score = 0;
    this.scoreText = this.add.text(16, 16, `Score: 0`, { fontSize: '20px', fill: '#222' })
    this.BestScoreText = this.add.text(16, 40, `Best Score: ${this.bestScore || 0}`, { fontSize: '16px', fill: '#444' })
  }

  saveBestScore() {
    if (this.score > this.bestScore) {
      localStorage.setItem(BEST_SCORE, this.score)
    }
  }

  gameOver() {
    this.isPaused = true
    console.log('GAME OVER')
    this.physics.pause();
    this.bird.setTint(0xee4824)
    this.bird.play('die')
    this.bird.y -= 10
    this.saveBestScore()
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.scene.restart();
        this.isPaused = false
      },
      loop: false
    })
  }

  pauseGame() {
    this.isPaused = true
    this.physics.pause();
    this.scene.pause();
    this.scene.launch(scenesName.PAUSE_SCENE)
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
          this.increasScore()
        }
      }
    })
  }

  flap() {
    if (this.isPaused) return
    // // this if for limit jump speed :/
    // if (this.bird.body.velocity.y < -200) {
    //   this.bird.body.velocity.y = -200
    // } else {
    //   this.bird.body.velocity.y += this.birdJumpVelocity
    // }
    this.bird.play('fly')
    this.bird.body.velocity.y += this.birdJumpVelocity

  }

  restart() {
    console.log('game over')
    this.bird.body.velocity.y = 0
    this.bird.x = this.config.birdInitialPosition.x
    this.bird.y = this.config.birdInitialPosition.y
  }

  placePipe(uPipe, bPipe) {
    let pipeHorizontalDistance = this.getRightLastPipe() + 500
    let pipeVerticalDistance = 200;
    // difculty Game 
    if (this.score > 1) {
      pipeVerticalDistance -= this.score * 2
      pipeHorizontalDistance -= this.score * 5
    }
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

  increasScore() {
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`)
    this.saveBestScore()
  }

}

export default PlayScene;