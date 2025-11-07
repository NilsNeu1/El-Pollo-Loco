class SalsaBar extends DrawableObject {

    IMAGE_THROWABLE = 'img/7_statusbars/3_icons/icon_salsa_bottle.png';
    availableBottles = 5;
    counterFontSize = 1;

    constructor(){
        super();
        this.loadImage(this.IMAGE_THROWABLE);
        this.posX = 230;
        this.posY = 15;
        this.height = 70;
        this.width = 70;
        
    }

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

    drawCounter(ctx) {
        ctx.font = '25px Arial';
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'white';
        ctx.textAlign = 'center';
        ctx.strokeText(this.availableBottles.toString(), this.posX + this.width - 25, this.posY + this.height + this.counterFontSize - 15);
        ctx.fillText(this.availableBottles.toString(), this.posX + this.width - 25, this.posY + this.height + this.counterFontSize - 15); // Position und Text des Counters
    }



 }