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
    this.bg = this.add.image(0, 0, "sky").setOrigin(0);
    this.bg.setDisplaySize(this.config.width, this.config.height);
    this.listenToResize();
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
