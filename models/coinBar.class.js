/**
 * Represents the coin status bar in the game UI.
 * Extends {@link DrawableObject} to display a coin icon and a counter
 * showing collected coins versus available coins.
 */
class CoinBar extends DrawableObject {

    /** @type {string} Path to the coin icon image */
    IMAGE_COIN = 'img/7_statusbars/3_icons/icon_coin.png';

    /** @type {number} Number of coins collected by the player */
    CollectedCoins = 0;

    /** @type {number} Total number of coins available in the level */
    AvailableCoins = 10;

    /** @type {number} Font size adjustment for the counter text */
    counterFontSize = 1;

    /**
     * Creates a new CoinBar instance.
     * Loads the coin icon image and sets its position and dimensions
     * on the canvas.
     */
    constructor() {
        super();
        this.loadImage(this.IMAGE_COIN);

        /** @type {number} X position of the coin bar on the canvas */
        this.posX = 280;

        /** @type {number} Y position of the coin bar on the canvas */
        this.posY = 25;

        /** @type {number} Width of the coin icon */
        this.width = 60;

        /** @type {number} Height of the coin icon */
        this.height = 60;
    }

    /**
     * Draws the coin counter next to the coin icon.
     * Displays collected coins versus available coins in a styled font.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    drawCounter(ctx) {
        ctx.font = '25px Arial'; // Font style and size
        ctx.fillStyle = 'black'; // Text fill color
        ctx.strokeStyle = 'white'; // Text outline color
        ctx.textAlign = 'center'; // Center alignment

        const text = this.CollectedCoins.toString() + '/' + this.AvailableCoins.toString();
        const x = this.posX + this.width - 5;
        const y = this.posY + this.height + this.counterFontSize - 15;

        ctx.strokeText(text, x, y);
        ctx.fillText(text, x, y);
    }
}