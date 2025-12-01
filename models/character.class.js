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
/**
 * Starts all animation intervals for movement, state changes, jumps, and sleep checks.
 */
animate() {
    this.startMovementAndCameraUpdates();
    this.startStateAnimations();
    this.startJumpAnimation();
    this.startSleepCheck();
}

/**
 * Starts the main loop for player movement and camera updates.
 */
startMovementAndCameraUpdates() {
    this.customeInterval(() => {
        if (!this.world.gamePaused) {
            this.handleMovement();
            this.handleJump();
            this.updateCamera();
        }
    }, 1000 / 60);
}

/**
 * Handles horizontal movement based on keyboard input.
 */
handleMovement() {
    if (this.world.keyboard.RIGHT && this.posX < this.world.level.level_end_X) {
        this.otherDirection = false;
        this.moveRight();
    }

    if (this.world.keyboard.LEFT && this.posX > 100) {
        this.otherDirection = true;
        this.moveLeft();
    }
}

/**
 * Handles jumping logic and sound.
 */
handleJump() {
    if (this.world.keyboard.UP && !this.isAboveGround()) {
        this.jump();
        this.world.soundManager.playSound('jump');
    }
}

/**
 * Updates the camera position relative to the player.
 */
updateCamera() {
    this.world.camera_x = -this.posX + 100;
}


/**
 * Starts the main loop for character state animations.
 */
startStateAnimations() {
    this.customeInterval(() => {
        this.updateIdleTimer();

        if (!this.world.gamePaused) {
            this.handleHurtAnimation();
            this.handleDeathAnimation();
            this.handleSleepAnimation();
            this.handleIdleAnimation();
            this.handleWalkingAnimation();
        }
    }, 1000 / 12);
}

    /**
     * Plays hurt animation and sound when character is hurt.
     * Ensures the hurt animation is shown even if the player is in the air,
     * and it won't be overridden by walking/idle animations.
     * Sound is throttled to avoid repetition.
     */
    handleHurtAnimation() {
        if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
            const now = Date.now();
            // Play 'hit' sound at most once every 500ms
            if (now - this.lastHurtSoundTime > 500) {
                this.world.soundManager.playSound('hit');
                this.lastHurtSoundTime = now;
            }
        }
    }

/**
 * Plays death animation if character is dead.
 */
    handleDeathAnimation() {
    if (this.isDead()) {
        this.playAnimation(this.IMAGES_DEAD);
    }
}

/**
 * Plays sleep animation if character falls asleep.
 */
    handleSleepAnimation() {
        // Only play sleep/long idle if not hurt or dead
        if (!this.isHurt() && !this.isDead() && this.fallsAsleep()) {
            this.playAnimation(this.IMAGES_LONGIDLE);
        }
    }

/**
 * Plays idle animation if character is not moving.
 */
    handleIdleAnimation() {
        // Only play idle animation if not hurt, not dead and not falling asleep
        if (!this.isHurt() && !this.isDead() && this.isNotMoving()) {
            this.playAnimation(this.IMAGES_IDLE);
        }
    }

/**
 * Plays walking animation if character moves left or right.
 */
    handleWalkingAnimation() {
        // Only show walking animation if player is not hurt and not dead
        if (!this.isHurt() && !this.isDead() && (this.world.keyboard.RIGHT || this.world.keyboard.LEFT)) {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }


/**
 * Plays jump animation while character is above ground at 6 FPS.
 */
startJumpAnimation() {
    this.customeInterval(() => {
        if (!this.world.gamePaused && this.isAboveGround() && !this.isHurt() && !this.isDead()) {
            this.playAnimation(this.IMAGES_JUMP);
        }
    }, 1000 / 6);
}

/**
 * Periodically checks if the character should fall asleep.
 */
startSleepCheck() {
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
