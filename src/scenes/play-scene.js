import BaseScene from "./base-scene";
import { scenesName, BEST_SCORE } from "./constance";

class PlayScene extends BaseScene {
  constructor(config) {
    super(scenesName.PLAY_SCENE, config);
    this.birdJumpVelocity = -300;
    this.isPaused = false;
    this.groundSize = 170;
  }

  create() {
    super.create();
    this.createMountains();
    this.createPipes();
    this.createGround();
    this.createBird();
    this.handleInputs();
    this.createPause();
    this.handleCollisWorld();
    this.handleCollisBirdAndPipe();
    this.createScore();
    this.listenToEvents();
    this.createAnims();
    this.isPaused = false;
  }

  createGround() {
    this.grounds = this.physics.add.group();
    for (let i = 0; i < 2; i++) {
      const ground = this.grounds.create(0, 0, "ground").setImmovable(true);
      // ground.setDisplaySize(ground.width, 170);

      this.placeGround(ground);
      ground.setBodySize(ground.width, ground.height - 40);
    }
    this.grounds.setVelocity(-200, 0);
  }

  createBird() {
    this.bird = this.physics.add
      .sprite(
        this.config.birdInitialPosition.x,
        this.config.birdInitialPosition.y,
        "bird"
      )
      .setScale(3)
      .setFlipX(true);
    this.bird.setBodySize(this.bird.width, this.bird.height - 8);
    this.bird.setCollideWorldBounds(true);
    this.bird.body.gravity.y = 600;
    this.bird.body.onWorldBounds = true;
  }

  handleInputs() {
    this.input.on("pointerdown", this.flap.bind(this));
    this.input.keyboard.on("keydown_SPACE", () => this.flap());
    this.input.keyboard.on("keydown_UP", () => this.flap());
    this.input.keyboard.on("keydown_ESC", () => this.pauseGame());
  }

  createPause() {
    const pauseButton = this.add
      .image(this.config.width - 15, 10, "pause")
      .setInteractive()
      .setOrigin(1, 0)
      .setScale(3);

    pauseButton.on("pointerdown", () => {
      this.pauseGame();
    });
  }

  handleCollisWorld() {
    this.physics.world.on("worldbounds", (body, up, down, left, right) => {
      if (down || up) {
        this.gameOver();
      }
    });
  }

  handleCollisBirdAndPipe() {
    this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
    this.physics.add.collider(
      this.bird,
      this.grounds,
      this.gameOver,
      null,
      this
    );
  }

  createScore() {
    this.score = 0;
    this.scoreText = this.add.text(16, 16, `Score: 0`, {
      fontSize: "26px",
      fill: "#fff",
    });
    this.BestScoreText = this.add.text(
      16,
      45,
      `Best Score: ${this.bestScore || 0}`,
      { fontSize: "18px", fill: "#fff" }
    );
  }

  listenToEvents() {
    if (this.eventListener) return;
    this.eventListener = this.events.on("resume", () => {
      this.resumeCountDownText = this.add
        .text(...this.centerScreen, "Continue in 3", this.fontStyle)
        .setOrigin(0.5);
      this.resumeCountDown = 3;
      this.timeEvent = this.time.addEvent({
        delay: 500,
        callback: () => this.countDown(),
        loop: true,
      });
    });
  }

  createAnims() {
    this.anims.create({
      key: "fly",
      frames: this.anims.generateFrameNumbers("bird", { start: 9, end: 15 }),
      frameRate: 32,
      repeat: 1,
    });

    this.anims.create({
      key: "die",
      frames: this.anims.generateFrameNumbers("bird", { start: 16, end: 18 }),
      frameRate: 8,
      // repeat: 0
    });

    this.bird.play("fly");
  }

  countDown() {
    this.resumeCountDown--;
    this.resumeCountDownText.setText(`Continue in ${this.resumeCountDown}`);
    if (this.resumeCountDown <= 0) {
      this.isPaused = false;
      this.timeEvent.remove();
      this.physics.resume();
      this.resumeCountDownText.setText("");
    }
  }

  saveBestScore() {
    if (this.score > this.bestScore) {
      localStorage.setItem(BEST_SCORE, this.score);
    }
  }

  gameOver() {
    if (this.isPaused) return;
    // if (this.isPaused) return;
    this.isPaused = true;
    // this.physics.pause();
    this.pipes.setVelocity(0, 0);
    this.grounds.setVelocity(0, 0);
    this.bird.setTint(0xee4824);
    this.bird.play("die");
    this.saveBestScore();
    this.restrartTime = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.scene.restart();
        this.pipes.setVelocity(-200, 0);
        this.grounds.setVelocity(-200, 0);
        this.isPaused = false;
        this.getLocalStorage();
      },
      loop: false,
      // callbackScope: this,
    });
  }

  pauseGame() {
    this.isPaused = true;
    this.physics.pause();
    this.scene.pause();
    this.scene.launch(scenesName.PAUSE_SCENE);
  }

  update() {
    this.recyclePipe();
  }

  recyclePipe() {
    const arrayPipes = this.pipes.getChildren();
    const passedPipe = [];
    arrayPipes.forEach((pipe) => {
      if (pipe.getBounds().right < 0) {
        passedPipe.push(pipe);
        if (passedPipe.length === 2) {
          this.placePipe(...passedPipe);
          this.increasScore();
        }
      }
    });
    const arrayClouds = this.clouds.getChildren();
    arrayClouds.forEach((cloud) => {
      if (cloud.getBounds().right < 0) {
        this.placeCloud(cloud);
      }
    });
    const arrayMountains = this.mountains.getChildren();
    arrayMountains.forEach((mountain) => {
      if (mountain.getBounds().right < 0) {
        this.placeMountain(mountain);
      }
    });
    const arrayGrounds = this.grounds.getChildren();
    arrayGrounds.forEach((ground) => {
      if (ground.getBounds().right < 0) {
        this.placeGround(ground);
      }
    });
  }

  flap() {
    if (this.isPaused) return;
    this.bird.play("fly");
    this.bird.body.velocity.y += this.birdJumpVelocity;
  }

  placePipe(uPipe, bPipe) {
    let pipeHorizontalDistance = this.getRightLastPipe() + 500;
    let pipeVerticalDistance = 200;
    // difculty Game
    if (this.score > 1) {
      pipeVerticalDistance -= this.score * 2;
      pipeHorizontalDistance -= this.score * 5;
    }
    const pipePositionRange = Phaser.Math.Between(
      20,
      this.config.height - this.groundSize - 20 - pipeVerticalDistance
    );
    uPipe.x = pipeHorizontalDistance;
    uPipe.y = pipePositionRange;
    bPipe.x = uPipe.x;
    bPipe.y = uPipe.y + pipeVerticalDistance;
  }

  placeMountain(mountain) {
    const mountainHorizontalDistance = this.getRightLastMountain() + 1024;
    const mountainPositionRange = this.config.height - this.groundSize;
    mountain.setOrigin(1, 1);
    mountain.x = mountainHorizontalDistance;
    mountain.y = mountainPositionRange;
    mountain.setScale(2);
  }

  placeGround(ground) {
    const GroundHorizontalDistance = this.getRightLastGround() + 1500;
    const GroundPositionRange = this.config.height;
    ground.setOrigin(1, 1);
    ground.x = GroundHorizontalDistance;
    ground.y = GroundPositionRange;
  }

  getRightLastPipe() {
    let rightLastPipe = -500;
    const arrayPipes = this.pipes.getChildren();
    arrayPipes.forEach((pipe) => {
      rightLastPipe = pipe.x > rightLastPipe ? pipe.x : rightLastPipe;
    });
    return rightLastPipe;
  }

  getRightLastMountain() {
    let rightLastMountain = 0;
    const arrayMountains = this.mountains.getChildren();
    arrayMountains.forEach((mountain) => {
      rightLastMountain =
        mountain.x > rightLastMountain ? mountain.x : rightLastMountain;
    });
    return rightLastMountain;
  }

  getRightLastGround() {
    let rightLastGround = 0;
    const arrayGrounds = this.grounds.getChildren();
    arrayGrounds.forEach((ground) => {
      rightLastGround = ground.x > rightLastGround ? ground.x : rightLastGround;
    });
    return rightLastGround;
  }

  increasScore() {
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`);
    this.saveBestScore();
  }

  createMountains() {
    this.mountains = this.physics.add.group();
    for (let i = 0; i < 5; i++) {
      const mountain = this.mountains.create(0, 0, "mountain");
      mountain.setDisplaySize(mountain.width, mountain.height * 2);

      this.placeMountain(mountain);
    }
    this.mountains.setVelocity(-20, 0);
  }
  createPipes() {
    this.pipes = this.physics.add.group();
    for (let i = 0; i < 4; i++) {
      const pipeTop = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 1);
      const pipeBottom = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 0);
      pipeTop.setDisplaySize(pipeTop.width, this.config.height);
      pipeBottom.setDisplaySize(pipeBottom.width, this.config.height);
      this.placePipe(pipeTop, pipeBottom);
    }
    this.pipes.setVelocity(-200, 0);
  }
}

export default PlayScene;
