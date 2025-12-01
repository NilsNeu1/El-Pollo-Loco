/**
 * Base class for top-of-screen status counters (e.g. coin counter, bottle counter).
 * Provides a common constructor and (default) rendering helper that child classes
 * can reuse or override.
 */
class StatCounter extends DrawableObject {

	/** @type {number} Font size adjustment for the counter text */
	counterFontSize = 1;

	/**
	 * Create a new StatCounter instance.
	 * @param {string} imagePath - Path to the icon image to display.
	 * @param {number} posX - X-position on the canvas.
	 * @param {number} posY - Y-position on the canvas.
	 * @param {number} width - Width of the icon.
	 * @param {number} height - Height of the icon.
	 */
	constructor(imagePath, posX = 0, posY = 0, width = 60, height = 60) {
		super();
		if (imagePath) this.loadImage(imagePath);
		this.posX = posX;
		this.posY = posY;
		this.width = width;
		this.height = height;
	}

	/** Default draw behavior delegates to DrawableObject */
	draw(ctx) {
		super.draw(ctx);
	}

	/**
	 * Default counter renderer - child classes should override or set
	 * `counterText` or provide their own drawCounter implementation.
	 * @param {CanvasRenderingContext2D} ctx
	 */
	drawCounter(ctx) {
		if (!this.counterText) return; // Nothing to draw by default

		ctx.font = '25px Arial';
		ctx.fillStyle = 'black';
		ctx.strokeStyle = 'white';
		ctx.textAlign = 'center';

		const text = this.counterText;
		const x = this.posX + this.width - 5;
		const y = this.posY + this.height + this.counterFontSize - 15;

		ctx.strokeText(text, x, y);
		ctx.fillText(text, x, y);
	}

}

/**
 * CoinBar displays a coin icon and the collected-versus-available counter.
 */
class CoinBar extends StatCounter {

	/** @type {string} Path to the coin icon image */
	IMAGE_COIN = 'img/7_statusbars/3_icons/icon_coin.png';

	/** @type {number} Number of coins collected by the player */
	CollectedCoins = 0;

	/** @type {number} Total number of coins available in the level */
	AvailableCoins = 10;

	/** @type {number} Font size adjustment for the counter text */
	counterFontSize = 1;

	constructor() {
		super();
		this.loadImage(this.IMAGE_COIN);
		this.posX = 280;
		this.posY = 25;
		this.width = 60;
		this.height = 60;
	}

	drawCounter(ctx) {
		ctx.font = '25px Arial';
		ctx.fillStyle = 'black';
		ctx.strokeStyle = 'white';
		ctx.textAlign = 'center';

		const text = this.CollectedCoins.toString() + '/' + this.AvailableCoins.toString();
		const x = this.posX + this.width - 5;
		const y = this.posY + this.height + this.counterFontSize - 15;

		ctx.strokeText(text, x, y);
		ctx.fillText(text, x, y);
	}

}

/**
 * SalsaBar displays the number of available bottles and a cooldown effect while throwing
 * is disabled.
 */
class SalsaBar extends StatCounter {

	/** @type {string} Path to the salsa bottle icon image */
	IMAGE_THROWABLE = 'img/7_statusbars/3_icons/icon_salsa_bottle.png';

	/** @type {number} Number of bottles currently available to the player */
	availableBottles = 5;

	/** @type {number} Font size adjustment for the counter text */
	counterFontSize = 1;

	constructor() {
		super();
		this.loadImage(this.IMAGE_THROWABLE);
		this.posX = 230;
		this.posY = 15;
		this.height = 70;
		this.width = 70;
	}

/**
 * Draws the entity with proper alpha handling.
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 */
draw(ctx) {
    try {
        const currentAlpha = ctx.globalAlpha;
        const alpha = this.calculateAlpha();

        this.applyAlpha(ctx, alpha);
        this.safeDraw(ctx);
        this.restoreAlpha(ctx, currentAlpha);
    } catch (e) {
        this.fallbackDraw(ctx);
    }
}

/**
 * Calculates the alpha value based on cooldown state.
 * @returns {number} Alpha value (1 = fully opaque, 0.5 = semi-transparent)
 */
calculateAlpha() {
    if (this.world && this.world.nextThrowAllowed) {
        if (Date.now() < this.world.nextThrowAllowed) {
            return 0.5; // semi-transparent during cooldown
        }
    }
    return 1;
}

/**
 * Applies the given alpha to the canvas context.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} alpha
 */
applyAlpha(ctx, alpha) {
    ctx.globalAlpha = alpha;
}

/**
 * Performs the actual drawing using the parent class.
 * @param {CanvasRenderingContext2D} ctx
 */
safeDraw(ctx) {
    super.draw(ctx);
}

/**
 * Restores the previous alpha value.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} previousAlpha
 */
restoreAlpha(ctx, previousAlpha) {
    ctx.globalAlpha = previousAlpha;
}

/**
 * Fallback drawing if an error occurs.
 * @param {CanvasRenderingContext2D} ctx
 */
fallbackDraw(ctx) {
    super.draw(ctx);
}


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

