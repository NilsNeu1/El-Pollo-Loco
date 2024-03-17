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
    offset = {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      };


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

    draw(ctx){
        ctx.drawImage(this.img, this.posX, this.posY, this.width, this.height);
    }

    drawHitbox(ctx){
        if (this instanceof Character || this instanceof Chicken) {
            
            ctx.beginPath();
            ctx.lineWidth = "2";
            ctx.strokeStyle = "yellow";
            ctx.rect(this.posX, this.posY, this.width, this.height);
            ctx.stroke();
        }
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

    // Bessere Formel zur Kollisionsberechnung (Genauer)
    isColliding(MO) {
        return (
          this.posX + this.width - this.offset.right >= MO.posX + MO.offset.left &&
          this.posX + this.offset.left < MO.posX + MO.width - MO.offset.right &&
          this.posY + this.height - this.offset.bottom >= MO.posY + MO.offset.top &&
          this.posY + this.offset.top < MO.posY + MO.height - MO.offset.bottom
        );
      }

}