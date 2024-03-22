class MovableObject extends DrawableObject {
    speed = 0.05;
    speedY = 1;
    otherDirection = false;
    acceleration = 0.2;
    health = 1500;
    lastHit = 0;
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



    

    drawHitbox(ctx){
        if (this instanceof Character || this instanceof Chicken) {
            
            ctx.beginPath();
            ctx.lineWidth = "2";
            ctx.strokeStyle = "yellow";
            ctx.rect(this.posX, this.posY, this.width, this.height);
            ctx.stroke();
        }
    }

  

    moveRight() {
        this.posX += this.speed;
    }

    moveLeft(){
        this.posX -= this.speed;
    }

    playAnimation(images){
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    jump(){
        this.speedY = 8;
    }

    isColliding(MO) {
        return (
          this.posX + this.width - this.offset.right >= MO.posX + MO.offset.left &&
          this.posX + this.offset.left < MO.posX + MO.width - MO.offset.right &&
          this.posY + this.height - this.offset.bottom >= MO.posY + MO.offset.top &&
          this.posY + this.offset.top < MO.posY + MO.height - MO.offset.bottom
        );
      }

      hit(){
        this.health -= 5;
        if (this.health < 0) {
            this.health = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
      }

      isHurt(){
        let timePassed = new Date().getTime() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed < 0.5;
      }

      isDead(){
        return this.health == 0;
      }

}