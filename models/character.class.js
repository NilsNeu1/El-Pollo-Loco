/**
 * Represents the main playable character in the game.
 * Extends {@link MovableObject} to provide movement, animations, gravity,
 * sound effects, and idle/sleep behavior.
 */
class Character extends MovableObject {

    /** @type {number} Height of the character */
    height = 250;

    /** @type {number} Width of the character */
    width = 250;

    /** @type {number} Horizontal scale factor for rendering */
    scaleX = 0.7;

    /** @type {number} Vertical scale factor for rendering */
    scaleY = 1;

    /** @type {number} Initial Y position of the character */
    posY = 10;

    /** @type {number} Movement speed of the character */
    speed = 6;

    /**
     * Collision offset values for fine-tuning hitbox detection.
     * @type {{top: number, bottom: number, left: number, right: number}}
     */
    offset = {
        top: 80,
        bottom: 10,
        left: 70,
        right: 95
    };

    /** @type {string[]} Idle animation frames */
    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    /** @type {string[]} Long idle animation frames (when character falls asleep) */
    IMAGES_LONGIDLE = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    /** @type {string[]} Walking animation frames */
    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

    /** @type {string[]} Jumping animation frames */
    IMAGES_JUMP = [
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png'
    ];

    /** @type {string[]} Hurt animation frames */
    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];

    /** @type {string[]} Dead animation frames */
    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];

    /** @type {number} Index of the current animation frame */
    currentImage = 0;

    /** @type {number} Timestamp of the last hurt sound played */
    lastHurtSoundTime = 0;

    /**
     * Creates a new Character instance.
     * Loads all animations, applies gravity, initializes sound manager,
     * and starts animation loops.
     */
    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONGIDLE);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMP);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.animate();
        this.applyGravity();
        /** @type {SoundManager} Handles sound effects for the character */
        this.soundManager = new SoundManager();
    }

    /**
     * Starts animation loops for movement, idle states, jumping, and hurt/dead states.
     * Uses custom intervals to update character state and play animations.
     */
    animate() {
        // Movement and camera updates
        this.customeInterval(() => {
            if (!this.world.gamePaused) {
                if (this.world.keyboard.RIGHT && this.posX < this.world.level.level_end_X) {
                    this.otherDirection = false;
                    this.moveRight();
                }

                if (this.world.keyboard.LEFT && this.posX > 100) {
                    this.otherDirection = true;
                    this.moveLeft();
                }

                if (this.world.keyboard.UP && !this.isAboveGround()) {
                    this.jump();
                    world.soundManager.playSound('jump');
                }

                this.world.camera_x = -this.posX + 100;
            }
        }, 1000 / 60);

        // Animation updates based on state
        this.customeInterval(() => {
            this.updateIdleTimer();

            if (!this.world.gamePaused) {
                if (this.isHurt() && !this.isAboveGround()) {
                    this.playAnimation(this.IMAGES_HURT);
                    world.soundManager.playSound('hit');
                } else if (this.isDead()) {
                    this.playAnimation(this.IMAGES_DEAD);
                } else if (this.fallsAsleep()) {
                    this.playAnimation(this.IMAGES_LONGIDLE);
                } else if (this.isNotMoving()) {
                    this.playAnimation(this.IMAGES_IDLE);
                } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                    this.playAnimation(this.IMAGES_WALKING);
                }
            }
        }, 1000 / 12);

        // Jump animation
        this.customeInterval(() => {
            if (!this.world.gamePaused && this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMP);
            }
        }, 1000 / 6);

        // Sleep check
        this.customeInterval(() => {
            this.fallsAsleep();
        }, 1000);
    }

    /**
     * Determines if the character has fallen asleep due to inactivity.
     * @returns {boolean} True if asleep, false otherwise.
     */
    fallsAsleep() {
        const currentTime = Date.now();
        const asleepDuration = currentTime - this.idleTimer;

        return this.isNotMoving() && asleepDuration >= 4000;
    }

    /**
     * Updates the idle timer based on character movement.
     * Resets the timer when the character starts moving.
     */
    updateIdleTimer() {
        if (this.isNotMoving()) {
            if (!this.idleTimer) {
                this.idleTimer = new Date().getTime();
            }
        } else {
            this.idleTimer = new Date().getTime();
        }
    }
}
