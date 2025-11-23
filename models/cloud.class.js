/**
 * Represents a cloud in the game background.
 * Extends {@link MovableObject} to provide movement and rendering.
 * Clouds are decorative elements that move left across the screen
 * to create a dynamic background effect.
 */
class Cloud extends MovableObject {

    /** @type {number} Width of the cloud sprite */
    width = 720;

    /** @type {number} Height of the cloud sprite */
    height = 480;

    /**
     * Creates a new Cloud instance.
     * Loads the cloud image, assigns a random X position,
     * sets Y position to the top of the canvas, and starts animation.
     */
    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');

        /** @type {number} Randomized X position between 0 and 3595 */
        this.posX = 0 + Math.random() * 3595;

        /** @type {number} Fixed Y position at the top of the canvas */
        this.posY = 0;

        this.animate();
    }

    /**
     * Starts the cloud’s animation.
     * Clouds continuously move left to simulate drifting across the sky.
     */
    animate() {
        this.moveLeft();
    }
}
