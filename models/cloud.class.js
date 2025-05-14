class Cloud extends MovableObject {

    width = 720;
    height = 480;
    
    constructor(){
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        
        this.posX = 0 + Math.random() * 3595; // ändert die geerbte position
        this.posY = 0;

        this.animate();
    }

    animate(){
        this.moveLeft();

    }


}