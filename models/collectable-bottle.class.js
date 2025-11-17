class CollectableBottle extends MovableObject{


height = 100;
width = 100;
offset = {
    top: 20,
    bottom: 10,
    left: 35,
    right: 25
};

constructor(){

        super().loadImage('img/6_salsa_bottle/2_salsa_bottle_on_ground.png');
        this.posX = 400 + Math.random() * 1000; 
        this.posY = 350;

    }


}