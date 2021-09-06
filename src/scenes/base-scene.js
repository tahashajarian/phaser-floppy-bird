import Phaser from "phaser";
import { BEST_SCORE } from "./constance";

class BaseScene extends Phaser.Scene {
  constructor(key, config) {
    super(key);
    this.config = config;
    this.centerScreen = [config.width / 2, config.height / 2];
    this.fontStyle = { fontSize: "32px", fill: "#fff" };
    this.lineHeight = 42;
    this.getLocalStorage();
  }

  getLocalStorage() {
    this.bestScore = localStorage.getItem(BEST_SCORE);
  }

  create() {
    // this.bg = this.add.image(0, 0, "sky").setOrigin(0);
    // this.bg.setDisplaySize(this.config.width, this.config.height);
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x00008b, 0x00008b, 0x87cefa, 0x87cefa, 1);
    graphics.fillRect(0, 0, this.config.width, this.config.height);

    this.listenToResize();
    this.createClouds();
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

  listenToResize() {
    window.addEventListener("resize", () => {
      // TODO: fix it later
      this.config.width = window.innerWidth;
      this.config.height = window.innerHeight;
      window.location.reload();
    });
  }

  createMenus(menu) {
    let lastItmeMenuY = 0;
    menu.forEach((menuItem) => {
      const textPosition = [
        this.centerScreen[0],
        this.centerScreen[1] + lastItmeMenuY,
      ];
      menuItem.textGO = this.add
        .text(...textPosition, menuItem.text, this.fontStyle)
        .setOrigin(0.5, 1);
      lastItmeMenuY += this.lineHeight;
      this.setUpMenuEvent(menuItem);
    });
  }
}

export default BaseScene;
