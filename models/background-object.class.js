/**
 * Represents a background object in the game world.
 * Extends {@link DrawableObject} to provide background images
 * that are positioned at a fixed height and width.
 */
class BackgroundObject extends DrawableObject {

    /** @type {number} Width of the background object */
    width = 720;

    /** @type {number} Height of the background object */
    height = 480;

    /**
     * Creates a new BackgroundObject instance.
     * Loads the given image and positions it at the specified X coordinate.
     * The Y position is automatically set so the object aligns with the bottom of the canvas.
     *
     * @param {string} imagePath - Path to the background image file.
     * @param {number} x - X-coordinate position of the background object.
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.posX = x;
        this.posY = 480 - this.height;
    }
}
