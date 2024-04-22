class CollectableCoin extends MovableObject{

    height = 150;
    width = 150;

constructor(){

        super().loadImage('img/8_coin/coin_1.png');
        this.posX = 400 + Math.random() * 1500; 
        this.posY = 150 - Math.random() * 180;

    }


}