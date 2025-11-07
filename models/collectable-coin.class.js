class CollectableCoin extends MovableObject{

    height = 150;
    width = 150;
    offset = {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50
    };

constructor(){

        super().loadImage('img/8_coin/coin_1.png');
        this.posX = 400 + Math.random() * 1500; 
        this.posY = 150 - Math.random() * 180;

    }


}