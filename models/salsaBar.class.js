/**
 * Represents the salsa bottle status bar in the game UI.
 * Extends {@link DrawableObject} to display the number of available bottles
 * and visually indicate cooldown when throwing is not allowed.
 */
class SalsaBar extends DrawableObject {

    /** @type {string} Path to the salsa bottle icon image */
    IMAGE_THROWABLE = 'img/7_statusbars/3_icons/icon_salsa_bottle.png';

    /** @type {number} Number of bottles currently available to the player */
    availableBottles = 5;

    /** @type {number} Font size adjustment for the counter text */
    counterFontSize = 1;

    /**
     * Creates a new SalsaBar instance.
     * Loads the salsa bottle icon image and sets its position and dimensions
     * on the canvas.
     */
    constructor() {
        super();
        this.loadImage(this.IMAGE_THROWABLE);

        /** @type {number} X position of the salsa bar on the canvas */
        this.posX = 230;

        /** @type {number} Y position of the salsa bar on the canvas */
        this.posY = 15;

        /** @type {number} Height of the salsa bar icon */
        this.height = 70;

        /** @type {number} Width of the salsa bar icon */
        this.width = 70;
    }

    /**
     * Draws the salsa bar icon on the canvas.
     * If the player is in cooldown (next throw not yet allowed),
     * the icon is rendered semi-transparent.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        try {
            const currentAlpha = ctx.globalAlpha;
            let alpha = 1;

            if (this.world && this.world.nextThrowAllowed) {
                if (Date.now() < this.world.nextThrowAllowed) {
                    alpha = 0.5; // semi-transparent during cooldown
                }
            }

            ctx.globalAlpha = alpha;
            super.draw(ctx);

            // restore alpha
            ctx.globalAlpha = currentAlpha;
        } catch (e) {
            // fallback to default drawing if anything goes wrong
            super.draw(ctx);
        }
    }

    /**
     * Draws the counter showing the number of available bottles.
     * Displays the count next to the salsa bottle icon.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    drawCounter(ctx) {
        ctx.font = '25px Arial';
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'white';
        ctx.textAlign = 'center';

        const text = this.availableBottles.toString();
        const x = this.posX + this.width - 25;
        const y = this.posY + this.height + this.counterFontSize - 15;

        ctx.strokeText(text, x, y);
        ctx.fillText(text, x, y);
    }
}
