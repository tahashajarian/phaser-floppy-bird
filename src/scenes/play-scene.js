import BaseScene from "./base-scene";
import { scenesName, BEST_SCORE } from "./constance";
import { getDifficulty, getMedal } from "../gameplay-utils.mjs";
import Phaser from "phaser/dist/phaser-arcade-physics";

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
    this.handleCollisions();
    this.createScore();
    this.listenToEvents();
    this.createAnims();
    this.deathSound = this.sound.add('death', { volume: .18 });
    this.groundImpactSound = this.sound.add('death', { volume: .14, rate: .65 });
    this.groundImpactPlayed = false;
    this.isPaused = false;
    this.isReady = false;
    this.physics.pause();
    this.startCountdown();
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
    this.input.on("pointerdown", (pointer) => {
      if (pointer.y > 72) this.flap();
    });
    this.input.keyboard.on("keydown-SPACE", () => this.flap());
    this.input.keyboard.on("keydown-UP", () => this.flap());
    this.input.keyboard.on("keydown-ESC", () => this.pauseGame());
  }

  createPause() {
    const pauseBg = this.add.circle(this.config.width - 32, 32, 21, 0x20203c, .82).setStrokeStyle(2, 0xffffff, .12);
    const pauseButton = this.add
      .image(this.config.width - 32, 32, "pause")
      .setInteractive()
      .setScale(2.25);

    pauseButton.on("pointerdown", () => {
      this.playTone('click');
      this.pauseGame();
    });
  }

  handleCollisWorld() {
    this.physics.world.on("worldbounds", (body, up, down, left, right) => {
      if (up) this.endGame(true);
      if (down) this.handleGroundHit();
    });
  }

  handleCollisions() {
    this.physics.add.collider(this.bird, this.pipes, this.handlePipeHit, null, this);
    this.physics.add.collider(
      this.bird,
      this.grounds,
      this.handleGroundHit,
      null,
      this
    );
  }

  handlePipeHit() {
    this.endGame(true);
  }

  handleGroundHit() {
    if (!this.groundImpactPlayed) {
      this.groundImpactPlayed = true;
      this.soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
      if (this.soundEnabled && this.groundImpactSound) this.groundImpactSound.play();
    }
    this.endGame(false);
  }

  createScore() {
    this.score = 0;
    this.scoreText = this.add.text(this.centerScreen[0], 32, `0`, {
      fontFamily: 'Trebuchet MS', fontSize: "42px", fontStyle: 'bold', color: "#fff",
      stroke: '#242442', strokeThickness: 7
    }).setOrigin(.5, 0);
    this.BestScoreText = this.add.text(
      this.centerScreen[0], 78, `BEST  ${this.bestScore || 0}`,
      { fontFamily: 'Trebuchet MS', fontSize: "12px", fontStyle: 'bold', color: "#ffd166" }
    ).setOrigin(.5, 0);
  }

  startCountdown() {
    let count = 3;
    const countdownText = this.add.text(this.centerScreen[0], this.centerScreen[1] - 78, `${count}`, {
      fontFamily: 'Trebuchet MS', fontSize: '58px', fontStyle: 'bold', color: '#ffffff',
      stroke: '#242442', strokeThickness: 7
    }).setOrigin(.5).setDepth(40);
    const hint = this.add.text(this.centerScreen[0], this.centerScreen[1] - 18, 'GET READY', {
      fontFamily: 'Trebuchet MS', fontSize: '12px', fontStyle: 'bold', color: '#ffd166', letterSpacing: 3
    }).setOrigin(.5).setDepth(40);
    this.playTone('countdown');
    this.time.addEvent({
      delay: 620, repeat: 3,
      callback: () => {
        count--;
        if (count > 0) {
          countdownText.setText(`${count}`);
          this.playTone('countdown');
          this.tweens.add({ targets: countdownText, scale: 1.25, duration: 100, yoyo: true });
        } else if (count === 0) {
          countdownText.setText('GO!').setColor('#ffd166').setFontSize(42);
          hint.setText('TAP • SPACE • ↑');
          this.playTone('score');
          this.physics.resume();
          this.isReady = true;
        } else {
          countdownText.destroy();
          hint.destroy();
        }
      }
    });
  }

  listenToEvents() {
    if (this.eventListener) return;
    this.eventListener = this.events.on("resume", () => {
      this.soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
      if (this.soundToggle) this.soundToggle.setText(this.soundEnabled ? 'SOUND  ON' : 'SOUND  OFF');
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
    if (!this.anims.exists('fly')) this.anims.create({
      key: "fly",
      frames: this.anims.generateFrameNumbers("bird", { start: 9, end: 15 }),
      frameRate: 32,
      repeat: 1,
    });

    if (!this.anims.exists('die')) this.anims.create({
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

  endGame(playDeathCue = true) {
    if (this.isPaused) return;
    // Lock first so overlapping physics callbacks cannot stack death sounds.
    this.isPaused = true;
    this.soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
    if (playDeathCue && this.soundEnabled && this.deathSound) {
      if (this.deathSound.isPlaying) this.deathSound.stop();
      this.deathSound.play();
    }
    // this.physics.pause();
    this.pipes.setVelocity(0, 0);
    this.grounds.setVelocity(0, 0);
    this.bird.setTint(0xee4824);
    this.bird.play("die");
    this.cameras.main.shake(160, .008);
    this.saveBestScore();
    this.time.delayedCall(350, () => this.showGameOver());
  }

  showGameOver() {
    this.createPanel(this.centerScreen[0], this.centerScreen[1], 292, 250, .94);
    this.add.text(this.centerScreen[0], this.centerScreen[1] - 86, 'FLIGHT OVER', {
      fontFamily: 'Trebuchet MS', fontSize: '28px', fontStyle: 'bold', color: '#ff6b6b'
    }).setOrigin(.5);
    this.add.text(this.centerScreen[0] - 60, this.centerScreen[1] - 30, 'SCORE', {
      fontFamily: 'Trebuchet MS', fontSize: '11px', fontStyle: 'bold', color: '#aaaac4'
    }).setOrigin(.5);
    this.add.text(this.centerScreen[0] - 60, this.centerScreen[1] - 2, `${this.score}`, this.fontStyle).setOrigin(.5);
    this.add.text(this.centerScreen[0] + 60, this.centerScreen[1] - 30, 'BEST', {
      fontFamily: 'Trebuchet MS', fontSize: '11px', fontStyle: 'bold', color: '#ffd166'
    }).setOrigin(.5);
    this.add.text(this.centerScreen[0] + 60, this.centerScreen[1] - 2, `${Math.max(this.score, Number(this.bestScore) || 0)}`, this.fontStyle).setOrigin(.5);
    const medal = getMedal(this.score);
    if (medal) {
      this.add.circle(this.centerScreen[0], this.centerScreen[1] + 42, 14, medal.color)
        .setStrokeStyle(3, 0xffffff, .35);
      this.add.text(this.centerScreen[0] + 24, this.centerScreen[1] + 42, `${medal.name} FLIGHT`, {
        fontFamily: 'Trebuchet MS', fontSize: '10px', fontStyle: 'bold', color: '#ffffff'
      }).setOrigin(0, .5);
    }
    const retry = this.createButton(this.centerScreen[0], this.centerScreen[1] + 88, 'FLY AGAIN', 210);
    retry.on('pointerup', () => { this.getLocalStorage(); this.scene.restart(); });
  }

  pauseGame() {
    if (!this.isReady || this.isPaused) return;
    this.isPaused = true;
    this.physics.pause();
    this.scene.pause();
    this.scene.launch(scenesName.PAUSE_SCENE);
  }

  update() {
    this.checkBoundaryCollision();
    this.recyclePipe();
    if (this.bird && this.bird.body && !this.isPaused && this.isReady) {
      const targetAngle = Phaser.Math.Clamp(this.bird.body.velocity.y * .09, -18, 72);
      this.bird.angle = Phaser.Math.Linear(this.bird.angle, targetAngle, .08);
    }
  }

  checkBoundaryCollision() {
    if (!this.bird || !this.bird.body || this.isPaused || !this.isReady) return;
    const hitCeiling = this.bird.body.top <= 0;
    const hitGround = this.bird.body.bottom >= this.config.height - this.groundSize + 12;
    if (hitCeiling) this.endGame(true);
    if (hitGround) this.handleGroundHit();
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
    if (this.isPaused || !this.isReady) return;
    this.bird.play("fly");
    this.bird.body.setVelocityY(this.birdJumpVelocity);
    this.tweens.add({ targets: this.bird, angle: -15, duration: 80 });
    this.playTone('flap');
    for (let i = 0; i < 4; i++) {
      const puff = this.add.circle(this.bird.x - 18, this.bird.y + Phaser.Math.Between(-8, 8), Phaser.Math.Between(2, 4), 0xffffff, .55);
      this.tweens.add({ targets: puff, x: puff.x - Phaser.Math.Between(16, 30), alpha: 0, scale: .2, duration: 320, onComplete: () => puff.destroy() });
    }
  }

  placePipe(uPipe, bPipe) {
    const difficulty = getDifficulty(this.score);
    const pipeHorizontalDistance = this.getRightLastPipe() + difficulty.distance;
    const pipeVerticalDistance = difficulty.gap;
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
    this.scoreText.setText(`${this.score}`);
    this.tweens.add({ targets: this.scoreText, scale: 1.24, duration: 90, yoyo: true });
    const speed = getDifficulty(this.score).speed;
    this.pipes.setVelocityX(-speed);
    this.playTone('score');
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
        .setFlipY(true)
        .setOrigin(0, 1);
      const pipeBottom = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 0);
      pipeTop.setDisplaySize(pipeTop.width, this.config.height);
      pipeBottom.setDisplaySize(pipeBottom.width, this.config.height);
      this.placePipe(pipeTop, pipeBottom);
    }
    this.pipes.setVelocity(-getDifficulty(this.score).speed, 0);
  }
}

export default PlayScene;
