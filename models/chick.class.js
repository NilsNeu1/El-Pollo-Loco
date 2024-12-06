class Chick extends MovableObject {

    health = 15;
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
        super().loadImage('img/3_enemies_chicken/chicken_small/2_dead/dead.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        
        this.posX = 400 + Math.random() * 500; // ändert die geerbte position
        this.animate();

        this.speed = 0.505 + Math.random() * 0.25;
        this.moveLeft();
        this.isCollidingFromAbove();
    }


    animate(){

        setInterval ( () => {
            this.moveLeft();
        }, 1000/ 10);

            if (this.health > 10) {
                this.playAnimation(this.IMAGES_WALKING); 
            } else {
                this.playAnimation(this.IMAGES_DEAD);
                this.deadChicken();
        }
        
    }

    deadChicken() {
        this.speed = 0;

        setInterval(() => {
            this.posY += 0.55;
        }, 20);
    }
}