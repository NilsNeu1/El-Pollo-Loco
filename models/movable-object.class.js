class MovableObject {
    posX = 100;
    posY = 350;
    speed = 0.05;
    speedY = 1;
    height = 75;
    width = 100;
    img;
    imageCache = {};
    otherDirection = false;
    acceleration = 0.2;


    applyGravity(){
        setInterval( () => {
            if(this.isAboveGround() || this.speedY > 0) {
                this.posY -= this.speedY;
                this.speedY -= this.acceleration;}
            
        }, 1000 /144);
    }

    isAboveGround(){
        return this.posY < 180;
    }

    loadImage(path) {
        this.img = new Image(); // this.img = doc.get element by id "img"
        this.img.src = path;
    }

    loadImages(array){
        array.forEach((path) => {
            
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    moveRight() {
        this.posX += this.speed;
    }

    moveLeft(){
        this.posX -= this.speed;
    }

    playAnimation(images){
        let i = this.currentImage %  this.IMAGES_WALKING.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    jump(){
        this.speedY = 8;
    }



}