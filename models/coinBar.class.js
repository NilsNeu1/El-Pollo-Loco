class CoinBar extends DrawableObject {

    IMAGES_COIN = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png'
    ];

    IMAGE_COIN = 'img/7_statusbars/3_icons/icon_coin.png'

    constructor(){
        super();
        this.loadImage(this.IMAGE_COIN);
        this.posX = 280;
        this.posY = 20;
        this.width = 60;
        this.height = 60;
    }


}