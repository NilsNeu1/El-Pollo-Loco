class SalsaBar extends DrawableObject {

    IMAGES_THROWABLE = [
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png'
    ];
    // percentage = 100;
    IMAGE_THROWABLE = 'img/7_statusbars/3_icons/icon_salsa_bottle.png';

    availableBottles = 5;
    counterFontSize = 1;

    constructor(){
        super();
        this.loadImages(this.IMAGES_THROWABLE);
        this.loadImage(this.IMAGE_THROWABLE);
        this.posX = 230;
        this.posY = 15;
        this.height = 70;
        this.width = 70;
        this.availableBottles;
        this.drawCounter();
    }

    drawCounter(ctx) {
        ctx.font = '20px, Arial'; // Schriftart und -größe
        ctx.fillStyle = 'black'; // Farbe des Texts
        ctx.textAlign = 'center'; // Zentrierung des Texts
        ctx.fillText(this.availableBottles.toString(), this.posX + this.width + 22, this.posY + this.height + this.counterFontSize + 5); // Position und Text des Counters
    }

 }