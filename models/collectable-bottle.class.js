class CollectableBottle extends DrawableObject{
    
    // IMAGE_BOTTLE = [
    //     'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
    //     'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    // ];

    height = 100;
    width = 100;

constructor(){

        super().loadImage('img/6_salsa_bottle/2_salsa_bottle_on_ground.png');
        this.posX = 200 + Math.random() * 100; 
        this.posY = 350;

    }


}