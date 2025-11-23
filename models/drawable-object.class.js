/**
 * Represents a drawable object in the game world.
 * Provides functionality for loading images, drawing them on a canvas,
 * and optionally rendering hitboxes for debugging or collision visualization.
 */
class DrawableObject {
    /** @type {number} X-coordinate position on the canvas */
    posX = 100;

    /** @type {number} Y-coordinate position on the canvas */
    posY = 350;

    /** @type {number} Height of the object */
    height = 75;

    /** @type {number} Width of the object */
    width = 100;

    /** @type {HTMLImageElement | undefined} Currently loaded image */
    img;

    /** @type {Object.<string, HTMLImageElement>} Cache of loaded images keyed by path */
    imageCache = {};

    /** @type {number} Index of the current image in an animation sequence */
    currentImage = 0;

    /**
     * Offset values used for collision detection and hitbox drawing.
     * @type {{top: number, left: number, bottom: number, right: number}}
     */
    offset = {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    };

    /**
     * Loads multiple images into the cache for animations or sprite switching.
     * @param {string[]} array - Array of image file paths.
     */
    loadImages(array) {
        array.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Loads a single image and sets it as the current drawable image.
     * @param {string} path - Path to the image file.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Draws the object on the given canvas context.
     * Supports scaling via `scale`, `scaleX`, and `scaleY` properties if defined.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        if (this.img) {
            try {
                const scaleX = (this.scaleX !== undefined) ? this.scaleX : (this.scale !== undefined ? this.scale : 1);
                const scaleY = (this.scaleY !== undefined) ? this.scaleY : (this.scale !== undefined ? this.scale : 1);

                if (scaleX === 1 && scaleY === 1) {
                    ctx.drawImage(this.img, this.posX, this.posY, this.width, this.height);
                } else {
                    const scaledWidth = this.width * scaleX;
                    const scaledHeight = this.height * scaleY;
                    const drawX = this.posX + (this.width - scaledWidth) / 2;
                    const drawY = this.posY + (this.height - scaledHeight);
                    ctx.drawImage(this.img, drawX, drawY, scaledWidth, scaledHeight);
                }
            } catch (e) {
                console.warn('Error drawing image:', e);
                console.log('Failed to load', this.img.src);
            }
        }
    }

    /**
     * Draws the hitbox of the object for debugging purposes.
     * Only applies to specific game entities (Character, Chicken, Endboss, Chick, CollectableBottle).
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    drawHitbox(ctx) {
        if (
            this instanceof Character ||
            this instanceof Chicken ||
            this instanceof Endboss ||
            this instanceof Chick ||
            this instanceof CollectableBottle
        ) {
            const x = this.posX + this.offset.left;
            const y = this.posY + this.offset.top;
            const width = this.width - this.offset.left - this.offset.right;
            const height = this.height - this.offset.top - this.offset.bottom;

            ctx.beginPath();
            ctx.lineWidth = "2";
            ctx.strokeStyle = "yellow";
            ctx.rect(x, y, width, height);
            ctx.stroke();
        }
    }
}
