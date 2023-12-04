class Chick extends MovableObject {

    height = 50;
    width = 50;
    posY = 380;
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png',];
        IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'];
    imageCache = {};
    currentImage = 0;


    constructor(){
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        
        this.posX = 200 + Math.random() * 500; // ändert die geerbte position
        this.animate();

        this.speed = 0.05 + Math.random() * 0.25;
        this.moveLeft();
    }


    animate(){

        setInterval ( () => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 1000/ 10);
    }
}