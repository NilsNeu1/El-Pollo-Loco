class Chicken extends MovableObject {

    health = 5;

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',];
        IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'];
    imageCache = {};
    currentImage = 0;


    constructor(){
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        
        this.posX = 600 + Math.random() * 500; // ändert die geerbte position
        this.animate();

        this.speed = 0.05 + Math.random() * 0.25;
        this.moveLeft();
        this.isCollidingFromAbove();
        this.isDead();
    }


    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 144);
    
        setInterval(() => {
            if (this.health > 4) {
                this.playAnimation(this.IMAGES_WALKING);
            } else {
                this.playAnimation(this.IMAGES_DEAD);
                this.deadChicken();
                console.log('Chicken is dead')
            }
        }, 1000 / 10);
    }

    deadChicken() {
        this.speed = 0; // Das Huhn stoppt, wenn es tot ist
        this.posY =+ 440;
    }


}