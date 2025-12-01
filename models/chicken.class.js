/**
 * Represents a normal chicken enemy in the game.
 * Extends {@link MovableObject} to provide movement, animations, health,
 * and death behavior when defeated.
 */
class Chicken extends MovableObject {

    /** @type {number} Health points of the chicken (default: 5) */
    health = 5;

    /**
     * Collision offset values for fine-tuning hitbox detection.
     * @type {{top: number, bottom: number, left: number, right: number}}
     */
    offset = {
        top: 5,
        bottom: 5,
        left: 8,
        right: 10
    };

    /** @type {string[]} Walking animation frames */
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    /** @type {string[]} Dead animation frame */
    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    /** @type {Object.<string, HTMLImageElement>} Cache of loaded images */
    imageCache = {};

    /** @type {number} Index of the current animation frame */
    currentImage = 0;

    /**
     * Creates a new Chicken instance.
     * Loads walking and dead animations, sets a random X position,
     * initializes movement speed, and starts animation.
     */
    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);

        /** @type {number} Randomized X position between 600 and 3700 */
        this.posX = 600 + Math.random() * 3100;

        this.animate();

        /** @type {number} Randomized movement speed between ~0.05 and ~0.3 */
        this.speed = 0.05 + Math.random() * 0.25;

        this.moveLeft();
        this.isCollidingFromAbove();
        this.isDead();
    }

    /**
     * Starts the chicken’s animation loop.
     * Moves left continuously and switches between walking and dead animations
     * depending on health.
     */
    animate() {
        this.handleMovementLoop();
        this.handleAnimationLoop();
    }

    /**
     * Handles the chicken’s movement to the left in a loop.
     */
    handleMovementLoop(){
        this.customeInterval(() => {
            if (!this.world.gamePaused) {
                this.moveLeft();
            }
        }, 1000 / 144);
    }

    /**
     * Handles the chicken’s animation loop.
     */
    handleAnimationLoop(){
        this.customeInterval(() => {
            if (!this.world.gamePaused) {
                if (this.health > 4) {
                    this.playAnimation(this.IMAGES_WALKING);
                } else {
                    this.deadChicken();
                }
            }
        }, 1000 / 6);
    }
    

    /**
     * Handles the chicken’s death behavior.
     * Stops movement and makes the chicken fall downward.
     */
    deadChicken() {
        this.speed = 0;

        this.playAnimation(this.IMAGES_DEAD);
        this.customeInterval(() => {
            this.posY += 3;
        }, 20);
    }
}
