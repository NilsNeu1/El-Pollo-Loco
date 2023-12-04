class BackgroundObject extends MovableObject{


    width = 720;
    height = 480;  
    constructor(imagePath, x){
        super().loadImage(imagePath);
        this.posX = x;
        this.posY = 480 - this.height;
        
    }

}