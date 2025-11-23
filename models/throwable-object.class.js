/**
 * Represents a throwable salsa bottle in the game.
 * Extends {@link MovableObject} to provide rotation, splash animations,
 * collision detection with enemies, and sound effects when thrown.
 */
class ThrowableObject extends MovableObject {

    /**
     * Image paths for bottle rotation animation.
     * @type {string[]}
     */
    IMAGES_ROTATE = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
    ];

    /**
     * Image paths for splash animation when the bottle breaks.
     * @type {string[]}
     */
    IMAGES_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
    ];

    /**
     * Creates a new ThrowableObject instance.
     * Loads rotation and splash animations, sets position and dimensions,
     * and immediately triggers the throw behavior.
     *
     * @param {number} x - Initial X position of the bottle.
     * @param {number} y - Initial Y position of the bottle.
     * @param {Level} level - Reference to the current level (for enemy collision checks).
     */
    constructor(x, y, level) {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.IMAGES_ROTATE);
        this.loadImages(this.IMAGES_SPLASH);

        /** @type {number} X position of the bottle */
        this.posX = x;

        /** @type {number} Y position of the bottle */
        this.posY = y;

        /** @type {number} Height of the bottle sprite */
        this.height = 100;

        /** @type {number} Width of the bottle sprite */
        this.width = 100;

        /** @type {Level} Reference to the current level */
        this.level = level;

        this.throw();

        /** @type {SoundManager} Reference to the global sound manager */
        this.soundManager = world.soundManager;
    }

    /**
     * Initiates the throw behavior.
     * Applies gravity, moves the bottle forward, rotates it,
     * and checks for collisions with enemies.
     */
    throw() {
        this.speedY = 7;
        this.gravityInterval = this.applyGravity(); // store gravity interval ID

        let moveInterval = setInterval(() => {
            this.posX += 8;
            this.level.enemies.forEach(enemy => {
                if (this.isColliding(enemy)) {
                    clearInterval(moveInterval);
                    clearInterval(rotateInterval);
                    clearInterval(this.gravityInterval); // stop gravity
                    this.splash(); // trigger splash animation
                    world.soundManager.playSound('brokenBottle');
                    enemy.hit();
                }
            });
        }, 10);

        let rotateInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_ROTATE);
        }, 80);
    }

    /**
     * Plays the splash animation when the bottle breaks.
     * Removes the bottle from the world once the animation finishes.
     */
    splash() {
        let splashCount = 0; // track splash frames
        let splashInterval = setInterval(() => {
            if (splashCount >= this.IMAGES_SPLASH.length) {
                clearInterval(splashInterval); // stop animation
                world.trowable.splice(world.trowable.indexOf(this), 1); // remove bottle
            } else {
                this.playAnimation([this.IMAGES_SPLASH[splashCount]]);
                splashCount++;
            }
        }, 80);
    }
}
