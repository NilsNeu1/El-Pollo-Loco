/**
 * Represents a movable object in the game world.
 * Extends {@link DrawableObject} to add movement, gravity, collision detection,
 * health management, and animation capabilities.
 */
class MovableObject extends DrawableObject {
    /** @type {number} Horizontal movement speed */
    speed = 0.05;

    /** @type {number} Vertical speed (used for gravity and jumping) */
    speedY = 1;

    /** @type {boolean} Indicates if the object is facing the opposite direction */
    otherDirection = false;

    /** @type {number} Gravity acceleration applied to vertical speed */
    acceleration = 0.2;

    /** @type {number} Current health points of the object */
    health = 100;

    /** @type {number} Timestamp of the last hit received */
    lastHit = 0;

    /** @type {number} Timer used to track idle state */
    idleTimer = new Date().getTime();

    /** @type {number} Tracks how long the object has been asleep */
    asleep = 0;

    /** @type {number[]} Stores active interval IDs for cleanup */
    intervalIDs = [];

    /**
     * Creates a custom interval and stores its ID for later cleanup.
     * @param {Function} callback - Function to execute at each interval.
     * @param {number} interval - Interval time in milliseconds.
     */
    customeInterval(callback, interval) {
        let id = setInterval(callback, interval);
        this.intervalIDs.push(id);
    }

    /**
     * Clears all stored intervals to prevent memory leaks or unwanted behavior.
     */
    clearAllIntervals() {
        this.intervalIDs.forEach(id => clearInterval(id));
        this.intervalIDs = [];
    }

    /**
     * Applies gravity to the object, pulling it down until it reaches the ground.
     * @returns {number} Interval ID for gravity updates.
     */
    applyGravity() {
        return setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.posY -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                clearInterval(this.gravityInterval);
            }
        }, 1000 / 144);
    }

    /**
     * Checks if the object is above the ground.
     * Throwable objects are always considered above ground.
     * @returns {boolean} True if above ground, false otherwise.
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.posY < 180;
        }
    }

    /** Moves the object to the right based on its speed. */
    moveRight() {
        this.posX += this.speed;
    }

    /** Moves the object to the left based on its speed. */
    moveLeft() {
        this.posX -= this.speed;
    }

    /**
     * Plays an animation by cycling through a set of images.
     * @param {string[]} images - Array of image paths for the animation.
     */
    playAnimation(images) {
        if (this.currentAnimationImages !== images) {
            this.currentImage = 0;
            this.currentAnimationImages = images;
        }

        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /** Makes the object jump by setting vertical speed upward. */
    jump() {
        this.speedY = 8;
    }

    /**
     * Checks if this object is colliding with another movable object.
     * @param {MovableObject} MO - Another movable object.
     * @returns {boolean} True if colliding, false otherwise.
     */
    isColliding(MO) {
        if (MO instanceof MovableObject) {
            return (
                this.posX + this.width - this.offset.right >= MO.posX + MO.offset.left &&
                this.posX + this.offset.left < MO.posX + MO.width - MO.offset.right &&
                this.posY + this.height - this.offset.bottom >= MO.posY + MO.offset.top &&
                this.posY + this.offset.top < MO.posY + MO.height - MO.offset.bottom
            );
        }
        return false;
    }

    /**
     * Checks if this object is colliding with another object from above.
     * @param {MovableObject} MO - Another movable object.
     * @returns {boolean} True if colliding from above, false otherwise.
     */
    isCollidingFromAbove(MO) {
        return (
            this.isColliding(MO) &&
            this.speedY < 0 &&
            this.posY + this.height - this.offset.bottom <= MO.posY + MO.offset.top + MO.height / 2
        );
    }

    /**
     * Applies damage to the object if not currently in invincibility frames.
     */
    hit() {
        if (!this.isHurt()) {
            this.health -= 20;
            if (this.health < 0) {
                this.health = 0;
            } else {
                this.lastHit = new Date().getTime();
            }
        }
    }

    /**
     * Determines if the object is currently in invincibility frames (i-frames).
     * @returns {boolean} True if hurt (in i-frames), false otherwise.
     */
    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed < 0.5;
    }

    /**
     * Checks if the object is dead (health = 0).
     * @returns {boolean} True if dead, false otherwise.
     */
    isDead() {
        return this.health == 0;
    }

    /**
     * Determines if the object is idle (not moving and not above ground).
     * @returns {boolean} True if not moving, false otherwise.
     */
    isNotMoving() {
        if (!this.world.keyboard.RIGHT && !this.world.keyboard.LEFT && !this.world.keyboard.UP && !this.isAboveGround()) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Check for collisions between this movable object (usually the player) and all enemies
     * in the level and handle collision consequences.
     * @returns {void}
     */
    checkCollisions() {
        if (!this.world || !this.world.level) return;
        const boss = this.getBossEnemy();
        this.world.level.enemies.forEach((enemy, index) => {
            if (this.isColliding(enemy)) {
                this.handleCollision(enemy, boss);
            }
            this.removeDeadEnemy(enemy, index);
        });
    }

    /**
     * Find the boss enemy in the current level.
     * @returns {Endboss | undefined}
     */
    getBossEnemy() {
        return this.world.level.enemies.find(e => e instanceof Endboss);
    }

    /**
     * Handle collision logic depending on enemy type and collision direction.
     * @param {Object} enemy - The enemy object collided with.
     * @param {Endboss} boss - The boss enemy reference.
     */
    handleCollision(enemy, boss) {
        if (!(enemy instanceof Chick || enemy instanceof Chicken || enemy instanceof Endboss)) return;

        if (this.isCollidingFromAbove(enemy)) {
            this.handleCollisionFromAbove(enemy);
        } else {
            this.handlePlayerHit(enemy, boss);
        }
    }

    /**
     * Handle collision when player lands on an enemy from above.
     * @param {Object} enemy - The enemy object collided with.
     */
    handleCollisionFromAbove(enemy) {
        if (!(enemy instanceof Endboss)) {
            this.damageEnemy(enemy);
            this.jump();

            if (enemy.health <= 5) {
                enemy.playAnimation(enemy.IMAGES_DEAD);
                enemy.deadChicken();
            }
        }
    }

    /**
     * Apply damage to an enemy.
     * @param {Object} enemy - The enemy object to damage.
     */
    damageEnemy(enemy) {
        if (typeof enemy.hit === 'function') {
            enemy.hit();
        } else {
            enemy.health -= 5;
        }
    }

    /**
     * Handle when the player gets hit by an enemy.
     * @param {Object} enemy - The enemy object.
     * @param {Endboss} boss - The boss enemy reference.
     */
    handlePlayerHit(enemy, boss) {
        if (typeof this.hit === 'function') this.hit();
        if (this.world?.healthbars) {
            this.world.healthbars.setPlayerPercentage(this.health);
            if (boss) this.world.healthbars.setBossPercentage(boss.health);
        }
        if (typeof this.world?.isGameLost === 'function') {
            this.world.isGameLost();
        }
    }

    /**
     * Remove enemy from level if dead and off-screen.
     * @param {Object} enemy - The enemy object.
     * @param {number} index - Index in enemies array.
     */
    removeDeadEnemy(enemy, index) {
        if (enemy.health <= 1 && enemy.posY > 500) {
            this.world.level.enemies.splice(index, 1);
        }
    }

}
