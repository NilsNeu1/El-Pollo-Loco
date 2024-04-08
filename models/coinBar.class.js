class CoinBar extends DrawableObject {

    IMAGE_COIN = 'img/7_statusbars/3_icons/icon_coin.png'
    CollectedCoins = 0;
    counterFontSize = 1;


    constructor(){
        super();
        this.loadImage(this.IMAGE_COIN);
        this.posX = 280;
        this.posY = 25;
        this.width = 60;
        this.height = 60;
    }


    drawCounter(ctx) {
        ctx.font = '25px Arial'; // Schriftart und -größe
        ctx.fillStyle = 'black'; // Farbe des Texts
        ctx.strokeStyle = 'white';
        ctx.textAlign = 'center'; // Zentrierung des Texts
        ctx.strokeText(this.CollectedCoins.toString(), this.posX + this.width - 15, this.posY + this.height + this.counterFontSize - 15);
        ctx.fillText(this.CollectedCoins.toString(), this.posX + this.width - 15, this.posY + this.height + this.counterFontSize - 15); // Position und Text des Counters
    }
}