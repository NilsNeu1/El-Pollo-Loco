class CollectableBottle extends MovableObject{
    
    // IMAGE_BOTTLE = [
    //     'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
    //     'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    // ];

    height = 100;
    width = 100;
    offset = {
        top: 20,
        bottom: 10,
        left: 30,
        right: 30
    };

constructor(){

        super().loadImage('img/6_salsa_bottle/2_salsa_bottle_on_ground.png');
        this.posX = 400 + Math.random() * 1000; 
        this.posY = 350;

    }


}