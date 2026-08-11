import Phaser from "phaser/dist/phaser-arcade-physics";
import { BEST_SCORE } from "./constance";

class BaseScene extends Phaser.Scene {
  constructor(key, config) {
    super(key);
    this.config = config;
    this.centerScreen = [config.width / 2, config.height / 2];
    this.fontStyle = { fontFamily: 'Trebuchet MS', fontSize: "32px", color: "#fff", fontStyle: 'bold' };
    this.lineHeight = 58;
    this.getLocalStorage();
    this.soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
  }

  getLocalStorage() {
    this.bestScore = localStorage.getItem(BEST_SCORE);
  }

  create() {
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x17172c, 0x17172c, 0x5454a8, 0x5454a8, 1);
    graphics.fillRect(0, 0, this.config.width, this.config.height);

    const sun = this.add.circle(this.config.width * .78, this.config.height * .2, 72, 0xffc857, .18);
    this.add.circle(sun.x, sun.y, 52, 0xffd166, .16);
    this.add.circle(sun.x, sun.y, 34, 0xffe29a, .95);

    for (let i = 0; i < 24; i++) {
      this.add.circle(
        Phaser.Math.Between(0, this.config.width),
        Phaser.Math.Between(0, Math.max(120, this.config.height * .62)),
        Phaser.Math.Between(1, 2), 0xffffff, Phaser.Math.FloatBetween(.18, .5)
      );
    }

    this.createClouds();
    this.createSoundToggle();
  }

  createClouds() {
    this.clouds = this.physics.add.group();
    for (let i = 0; i < 9; i++) {
      const cloud = this.clouds.create(0, 0, "cloud");
      this.placeCloud(cloud);
    }
    this.clouds.setVelocity(-30, 0);
  }

  placeCloud(cloud) {
    const cloundHorizontalDistance =
      this.getRightLastCloud() + Phaser.Math.Between(200, 250);
    const cloundPositionRange = Phaser.Math.Between(20, 200);
    cloud.x = cloundHorizontalDistance;
    cloud.y = cloundPositionRange;
    cloud.setScale(Math.random() * (0.9 - 0.3) + 0.3);
  }

  getRightLastCloud() {
    let rightLastCloud = 0;
    const arrayClouds = this.clouds.getChildren();
    arrayClouds.forEach((cloud) => {
      rightLastCloud = cloud.x > rightLastCloud ? cloud.x : rightLastCloud;
    });
    return rightLastCloud;
  }

  playTone(type = 'click') {
    if (!this.soundEnabled) return;
    const nowMs = performance.now();
    const cooldowns = { click: 80, flap: 55, score: 100, countdown: 120 };
    this.lastToneAt = this.lastToneAt || {};
    if (nowMs - (this.lastToneAt[type] || 0) < cooldowns[type]) return;
    this.lastToneAt[type] = nowMs;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.audioContext = this.audioContext || new AudioContext();
    if (this.audioContext.state === 'suspended') this.audioContext.resume();
    const settings = {
      click: [440, .035, 'sine'], flap: [620, .07, 'square'],
      score: [880, .09, 'sine'], countdown: [520, .06, 'sine']
    }[type];
    const [frequency, duration, wave] = settings;
    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    oscillator.type = wave;
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    if (type === 'flap') oscillator.frequency.exponentialRampToValueAtTime(820, this.audioContext.currentTime + duration);
    gain.gain.setValueAtTime(.045, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, this.audioContext.currentTime + duration);
    oscillator.connect(gain).connect(this.audioContext.destination);
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  createSoundToggle() {
    const label = this.soundEnabled ? 'SOUND  ON' : 'SOUND  OFF';
    this.soundToggle = this.add.text(18, 18, label, {
      fontFamily: 'Trebuchet MS', fontSize: '11px', fontStyle: 'bold', color: '#ffffff',
      backgroundColor: '#20203c', padding: { x: 9, y: 7 }
    }).setInteractive({ useHandCursor: true }).setDepth(50).setAlpha(.82);
    this.soundToggle.on('pointerup', () => {
      this.soundEnabled = !this.soundEnabled;
      localStorage.setItem('soundEnabled', this.soundEnabled);
      this.soundToggle.setText(this.soundEnabled ? 'SOUND  ON' : 'SOUND  OFF');
      this.playTone('click');
    });
  }

  createPanel(x, y, width, height, alpha = .86) {
    const shadow = this.add.rectangle(x + 7, y + 9, width, height, 0x080816, .3).setOrigin(.5);
    const panel = this.add.rectangle(x, y, width, height, 0x20203c, alpha).setOrigin(.5);
    panel.setStrokeStyle(2, 0xffffff, .14);
    return { shadow, panel };
  }

  createButton(x, y, label, width = 230) {
    const container = this.add.container(x, y);
    const shadow = this.add.rectangle(4, 6, width, 48, 0x090916, .45).setOrigin(.5);
    const bg = this.add.rectangle(0, 0, width, 48, 0x34345e, .98).setOrigin(.5);
    bg.setStrokeStyle(2, 0xffffff, .12);
    const text = this.add.text(0, -1, label, {
      fontFamily: 'Trebuchet MS', fontSize: '19px', fontStyle: 'bold', color: '#ffffff'
    }).setOrigin(.5);
    container.add([shadow, bg, text]);
    container.setSize(width, 48).setInteractive({ useHandCursor: true });
    container.on('pointerover', () => { bg.setFillStyle(0xff6b6b); container.setScale(1.035); });
    container.on('pointerout', () => { bg.setFillStyle(0x34345e); container.setScale(1); });
    container.on('pointerdown', () => container.setScale(.98));
    container.on('pointerup', () => this.playTone('click'));
    return container;
  }

  createMenus(menu) {
    let lastItmeMenuY = 0;
    menu.forEach((menuItem) => {
      const textPosition = [
        this.centerScreen[0],
        this.centerScreen[1] + lastItmeMenuY,
      ];
      menuItem.textGO = this.createButton(textPosition[0], textPosition[1], menuItem.text);
      lastItmeMenuY += this.lineHeight;
      this.setUpMenuEvent(menuItem);
    });
    this.menuItems = menu;
    this.selectedMenuIndex = 0;
    this.updateMenuSelection();
    this.input.keyboard.on('keydown-UP', () => this.moveMenuSelection(-1));
    this.input.keyboard.on('keydown-DOWN', () => this.moveMenuSelection(1));
    this.input.keyboard.on('keydown-ENTER', () => {
      const selected = this.menuItems[this.selectedMenuIndex];
      if (selected && selected.textGO) selected.textGO.emit('pointerup');
    });
  }

  moveMenuSelection(direction) {
    this.selectedMenuIndex = Phaser.Math.Wrap(this.selectedMenuIndex + direction, 0, this.menuItems.length);
    this.updateMenuSelection();
    this.playTone('click');
  }

  updateMenuSelection() {
    this.menuItems.forEach((item, index) => item.textGO.setAlpha(index === this.selectedMenuIndex ? 1 : .72));
  }
}

export default BaseScene;
