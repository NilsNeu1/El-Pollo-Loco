/**
 * Represents a collectable coin in the game world.
 * Extends {@link MovableObject} to provide positioning, collision offsets,
 * and rendering of the coin sprite. Coins can be collected by the player
 * to increase their score or progress.
 */
class CollectableCoin extends MovableObject {

    /** @type {number} Height of the coin sprite */
    height = 150;

    /** @type {number} Width of the coin sprite */
    width = 150;

    /**
     * Collision offset values for fine-tuning hitbox detection.
     * @type {{top: number, bottom: number, left: number, right: number}}
     */
    offset = {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50
    };

    /**
     * Creates a new CollectableCoin instance.
     * Loads the coin image, assigns a random X position,
     * and sets a randomized Y position to vary placement.
     */
    constructor() {
        super().loadImage('img/8_coin/coin_1.png');

        /** @type {number} Randomized X position between 400 and 1900 */
        this.posX = 400 + Math.random() * 1500;

        /** @type {number} Randomized Y position between 50 and 150 */
        this.posY = 150 - Math.random() * 100;
    }
}
