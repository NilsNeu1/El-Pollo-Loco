/**
 * Represents the health bar of the end boss in the game.
 * Extends {@link DrawableObject} to display different health states
 * based on the boss's remaining percentage of health.
 */
class BossBar extends DrawableObject {

    /**
     * Image paths for different health states of the boss.
     * Ordered from empty (0%) to full (100%).
     * @type {string[]}
     */
    IMAGES_HEALTH = [
        'img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue100.png'
    ];

    /** @type {number} Current health percentage of the boss (0–100). */
    percentage = 100;

    /**
     * Creates a new BossBar instance.
     * Loads health images, sets initial percentage to 100,
     * and positions the bar on the canvas.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_HEALTH);
        this.setPercentage(100);

        /** @type {number} X position of the boss bar on the canvas */
        this.posX = 480;

        /** @type {number} Y position of the boss bar on the canvas */
        this.posY = 20;

        /** @type {number} Width of the boss bar */
        this.width = 220;
    }

    /**
     * Updates the boss bar to reflect the given health percentage.
     * Selects the appropriate image based on the resolved index.
     *
     * @param {number} percentage - New health percentage (0–100).
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES_HEALTH[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Resolves the correct image index based on the current health percentage.
     * @returns {number} Index of the image in {@link IMAGES_HEALTH}.
     */
    resolveImageIndex() {
        if (this.percentage == 100) {
            return 5;
        } else if (this.percentage >= 80) {
            return 4;
        } else if (this.percentage >= 60) {
            return 3;
        } else if (this.percentage >= 40) {
            return 2;
        } else if (this.percentage >= 20) {
            return 1;
        } else if (this.percentage == 0) {
            return 0;
        }
    }
}
