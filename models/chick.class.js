class Chick extends MovableObject {

    health = 15;
    height = 50;
    width = 50;
    posY = 380;
    offset = {
        top: 0,
        bottom: 0,
        left: 5,
        right: 0,
    };
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'];
        IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'];
    imageCache = {};
    currentImage = 0;


    constructor(){
        super().loadImage('img/3_enemies_chicken/chicken_small/2_dead/dead.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.posX = 600 + Math.random() * 3100; // ändert die geerbte position
        this.animate();
        this.speed = 0.505 + Math.random() * 0.25;
        this.moveLeft();
        this.isCollidingFromAbove();
    }


    animate() {
        this.customeInterval(() => {
            if (!this.world.gamePaused) {
                this.moveLeft();
                if (this.health > 10) {
                    this.playAnimation(this.IMAGES_WALKING); 
                } else {
                    this.playAnimation(this.IMAGES_DEAD);
                    this.deadChicken();
                }
            }
        }, 1000 / 6);
    }

    deadChicken() {
        this.speed = 0;

        this.customeInterval(() => {
            this.posY += 3;
        }, 20);
    }

    

}

