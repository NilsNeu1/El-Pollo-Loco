/**
 * Represents a small chicken enemy in the game.
 * Extends {@link MovableObject} to provide movement, animations, health,
 * and death behavior when defeated.
 */
class Chick extends MovableObject {

    /** @type {number} Health points of the chick (default: 15) */
    health = 15;

    /** @type {number} Height of the chick sprite */
    height = 50;

    /** @type {number} Width of the chick sprite */
    width = 50;

    /** @type {number} Initial Y position of the chick */
    posY = 380;

    /**
     * Collision offset values for fine-tuning hitbox detection.
     * @type {{top: number, bottom: number, left: number, right: number}}
     */
    offset = {
        top: 0,
        bottom: 0,
        left: 5,
        right: 0,
    };

    /** @type {string[]} Walking animation frames */
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    /** @type {string[]} Dead animation frame */
    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    /** @type {Object.<string, HTMLImageElement>} Cache of loaded images */
    imageCache = {};

    /** @type {number} Index of the current animation frame */
    currentImage = 0;

    /**
     * Creates a new Chick instance.
     * Loads walking and dead animations, sets a random X position,
     * initializes movement speed, and starts animation.
     */
    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_small/2_dead/dead.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.posX = 600 + Math.random() * 3100;
        this.animate();
        this.speed = 0.505 + Math.random() * 0.25;
        this.moveLeft();
        this.isCollidingFromAbove();
    }

    /**
     * Starts the chick’s animation loop.
     */
    animate() {
        this.customeInterval(() => {
            if (!this.world.gamePaused) {
                this.handleMovement();
                this.handleAnimationState();
            }
        }, 1000 / 6);
    }

    /**
     * Handles continuous leftward movement.
     */
    handleMovement() {
        this.moveLeft();
    }

    /**
     * Chooses and plays the correct animation based on health.
     */
    handleAnimationState() {
        if (this.health > 10) {
            this.playAnimation(this.IMAGES_WALKING);
        } else {
            this.playAnimation(this.IMAGES_DEAD);
            this.deadChicken();
        }
    }

    /**
     * Handles the chick’s death behavior.
     * Stops movement and makes the chick fall downward.
     */
    deadChicken() {
        this.speed = 0;

        this.customeInterval(() => {
            this.posY += 3;
        }, 20);
    }
}
