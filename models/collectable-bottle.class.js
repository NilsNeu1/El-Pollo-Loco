/**
 * Represents a collectable salsa bottle in the game world.
 * Extends {@link MovableObject} to provide positioning, collision offsets,
 * and rendering of the bottle sprite. Bottles can be collected by the player
 * and are typically placed on the ground.
 */
class CollectableBottle extends MovableObject {

    /** @type {number} Height of the bottle sprite */
    height = 100;

    /** @type {number} Width of the bottle sprite */
    width = 100;

    /**
     * Collision offset values for fine-tuning hitbox detection.
     * @type {{top: number, bottom: number, left: number, right: number}}
     */
    offset = {
        top: 20,
        bottom: 10,
        left: 35,
        right: 25
    };

    /**
     * Creates a new CollectableBottle instance.
     * Loads the bottle image, assigns a random X position,
     * and sets a fixed Y position on the ground.
     */
    constructor() {
        super().loadImage('img/6_salsa_bottle/2_salsa_bottle_on_ground.png');

        /** @type {number} Randomized X position between 400 and 1400 */
        this.posX = 400 + Math.random() * 1000;

        /** @type {number} Fixed Y position on the ground */
        this.posY = 350;
    }
}
