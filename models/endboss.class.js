/**
 * Represents the end boss enemy in the game.
 * Extends {@link MovableObject} to provide movement, animations, health,
 * attack sequences, and alert behavior. The boss has multiple states:
 * idle, walking, alert, attacking, hurt, and dead.
 */
class Endboss extends MovableObject {

    /** @type {number} Height of the boss sprite */
    height = 450;

    /** @type {number} Width of the boss sprite */
    width = 250;

    /** @type {number} Y position of the boss on the canvas */
    posY = 20;

    /** @type {number} X position of the boss on the canvas */
    posX = 3600;

    /** @type {number} Health points of the boss (default: 100) */
    health = 100;

    /** @type {number} Movement speed of the boss */
    speed = 6.5;

    /** @type {boolean} Whether the boss is currently attacking */
    attacking = false;

    /** @type {boolean} Whether the alert sequence has already been played */
    alertSequencePlayed = false;

    /** @type {SoundManager} Reference to the global sound manager */
    soundManager = world.soundManager;

    /**
     * Collision offset values for fine-tuning hitbox detection.
     * @type {{top: number, bottom: number, left: number, right: number}}
     */
    offset = {
        top: 50,
        bottom: 50,
        left: 20,
        right: 20
    };

    /** @type {boolean} Flag to determine if the boss should move left */
    shouldMoveLeft = false;

    /** @type {string[]} Walking animation frames */
    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    /** @type {string[]} Alert animation frames */
    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    /** @type {string[]} Attack animation frames */
    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    /** @type {string[]} Hurt animation frames */
    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    /** @type {string[]} Dead animation frames */
    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    /** @type {string[]} Idle animation frames (reused alert frames) */
    IMAGES_IDLE = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png'
    ];

    /** @type {Object.<string, HTMLImageElement>} Cache of loaded images */
    imageCache = {};

    /** @type {number} Index of the current animation frame */
    currentImage = 0;

    /**
     * Creates a new Endboss instance.
     * Loads all animations, starts animation loop, and checks death state.
     */
    constructor() {
        super().loadImage('img/4_enemie_boss_chicken/5_dead/G26.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.animate();
        this.isDead();
    }

    /**
     * Starts the boss’s animation loop.
     * Orchestrates state transitions at 8 FPS.
     */
    animate() {
        let i = 0;
        let w = 4;

        this.customeInterval(() => {
            if (!this.world.gamePaused) {
                if (this.isHurt()) {
                    this.handleHurtState();
                } else if (this.isDead()) {
                    this.handleDeadState();
                } else if (i < 16 && this.isAlerted()) {
                    this.handleAlertState(i);
                    i++;
                } else if (i >= 16 && w < 4) {
                    this.handleAttackState();
                } else if (w >= 4 && this.isAlerted()) {
                    this.handleWalkingState();
                } else {
                    this.handleIdleState();
                }
            }
        }, 1000 / 8);
    }

    /**
     * Handles boss hurt state.
     */
    handleHurtState() {
        this.playAnimation(this.IMAGES_HURT);
        this.posX -= 50;
    }

    /**
     * Handles boss death state.
     */
    handleDeadState() {
        this.playAnimation(this.IMAGES_DEAD);
        this.world.bossDefeated = true;
    }

    /**
     * Handles boss alert state.
     * @param {number} i - Counter for alert frames.
     */
    handleAlertState(i) {
        this.playAnimation(this.IMAGES_ALERT);
    }

    /**
     * Handles boss attack state.
     */
    handleAttackState() {
        this.playAnimation(this.IMAGES_ATTACK);
    }

    /**
     * Handles boss walking state.
     */
    handleWalkingState() {
        this.moveLeft();
        this.playAnimation(this.IMAGES_WALKING);
    }

    /**
     * Handles boss idle state.
     */
    handleIdleState() {
        this.playAnimation(this.IMAGES_IDLE);
    }

    /**
     * Determines if the boss is alerted (aggressive state).
     * Sets attacking flag accordingly.
     * @returns {boolean} True if boss is alerted, false otherwise.
     */
    isAlerted() {
        if (this.world.bossAgro === true) {
            this.attacking = true;
            return true;
        } else {
            this.attacking = false;
            return false;
        }
    }
}