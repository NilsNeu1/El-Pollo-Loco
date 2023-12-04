class MovableObject {
    posX = 100;
    posY = 350;
    speed = 0.05;
    height = 75;
    width = 100;
    img;
    imageCache = {};
    otherDirection = false;


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
        console.log('move right');
    }

    moveLeft(){
        setInterval(() => {
            this.posX -= this.speed;
        }, 1000/ 144); // milisekunden interval/ Framerate
    }

    playAnimation(images){
        let i = this.currentImage %  this.IMAGES_WALKING.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }



}