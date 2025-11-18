class Chicken extends MovableObject {

    health = 5;
    offset = {
        top: 5,
        bottom: 5,
        left: 10,
        right: 10
    };

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',];
    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'];
    imageCache = {};
    currentImage = 0;


    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);

        this.posX = 600 + Math.random() * 3100; // ändert die geerbte position
        this.animate();

        this.speed = 0.05 + Math.random() * 0.25;
        this.moveLeft();
        this.isCollidingFromAbove();
        this.isDead();
    }


    animate() {
        this.customeInterval(() => {
            if (!this.world.gamePaused) {
                this.moveLeft();
            }
        }, 1000 / 144);

        this.customeInterval(() => {
            if (!this.world.gamePaused) {
                if (this.health > 4) {
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