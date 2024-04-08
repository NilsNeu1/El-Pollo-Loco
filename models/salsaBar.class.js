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

    drawCounter(ctx) {
        ctx.font = '25px Arial'; // Schriftart und -größe
        ctx.fillStyle = 'black'; // Farbe des Texts
        ctx.strokeStyle = 'white';
        ctx.textAlign = 'center'; // Zentrierung des Texts
        ctx.strokeText(this.availableBottles.toString(), this.posX + this.width - 25, this.posY + this.height + this.counterFontSize - 15);
        ctx.fillText(this.availableBottles.toString(), this.posX + this.width - 25, this.posY + this.height + this.counterFontSize - 15); // Position und Text des Counters
    }

 }