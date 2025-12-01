/**
 * Represents a health bar in the game (player or boss).
 * Extends {@link DrawableObject} to display different health states
 * based on the entity’s remaining percentage of health.
 */
class HealthBar extends DrawableObject {
    /**
     * Configuration map for different health bar types.
     * Each type defines its image set and default position.
     */
    static CONFIG = {
        boss: {
            images: [
                'img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
                'img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
                'img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
                'img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
                'img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
                'img/7_statusbars/2_statusbar_endboss/blue/blue100.png'
            ],
            posX: 480,
            posY: 20
        },
        player: {
            images: [
                'img/7_statusbars/1_statusbar/2_statusbar_health/orange/0.png',
                'img/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png',
                'img/7_statusbars/1_statusbar/2_statusbar_health/orange/40.png',
                'img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
                'img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
                'img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png'
            ],
            posX: 10,
            posY: 10
        }
    };

    /** @type {number} Current health percentage (0–100). */
    percentage = 100;

    /**
     * Creates a new HealthBar instance.
     *
     * @param {"boss"|"player"} type - Type of health bar to create.
     * @param {number} [initialPercentage=100] - Starting health percentage.
     */
    constructor(type = 'player', initialPercentage = 100) {
        super();
        const config = HealthBar.CONFIG[type];
        this.IMAGES_HEALTH = config.images;
        this.posX = config.posX;
        this.posY = config.posY;
        this.width = 220;
        this.percentage = initialPercentage;
        this.loadImages(this.IMAGES_HEALTH);
        this.setPercentage(this.percentage);
    }

    /**
     * Updates the health bar to reflect the given health percentage.
     * @param {number} percentage - New health percentage (0–100).
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        const path = this.IMAGES_HEALTH[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Resolves the correct image index based on the current health percentage.
     * @returns {number} Index of the image in {@link IMAGES_HEALTH}.
     */
    resolveImageIndex() {
        if (this.percentage === 100) return 5;
        if (this.percentage >= 80) return 4;
        if (this.percentage >= 60) return 3;
        if (this.percentage >= 40) return 2;
        if (this.percentage >= 20) return 1;
        return 0;
    }
}

/**
 * BossBar — specialized HealthBar using the boss images/position from CONFIG.
 * World code uses `new BossBar()` directly, so we expose this class.
 */
class BossBar extends HealthBar {
    constructor(initialPercentage = 100) {
        super('boss', initialPercentage);
        this.width = 220;
    }
}

/**
 * Healthbars manager — holds both player and boss bars and decides what to draw.
 * This class provides a single drawable object that the `World` can add to map.
 */
class Healthbars extends DrawableObject {
    /**
     * Create combined health bars manager.
     * @param {World} world - Reference to the game world (used for checking bossAgro)
     */
    constructor(world) {
        super();
        this.world = world;
        this.playerBar = new HealthBar('player');
        this.bossBar = new BossBar();
        this.width = 0;
        this.height = 0;
    }

    setPlayerPercentage(percentage) {
        this.playerBar.setPercentage(percentage);
    }

    setBossPercentage(percentage) {
        this.bossBar.setPercentage(percentage);
    }

    draw(ctx) {
        this.playerBar.draw(ctx);
        if (
            this.world &&
            this.world.bossAgro &&
            (!this.world.gameStateUi || this.world.gameStateUi.state !== 'menu')
        ) {
            this.bossBar.draw(ctx);
        }
    }
}