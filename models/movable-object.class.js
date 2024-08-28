class MovableObject extends DrawableObject {
    speed = 0.05;
    speedY = 1;
    otherDirection = false;
    acceleration = 0.2;
    health = 100;
    lastHit = 0;
    idleTimer = new Date().getTime();
    asleep = 0;


    applyGravity() {
        return setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.posY -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                clearInterval(this.gravityInterval);
            }
        }, 1000 / 144);
    }

    isAboveGround(){

        if (this instanceof ThrowableObject) {
          return true;
        } 
        else {
          return this.posY < 180;
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
      

      if (MO instanceof MovableObject) {
          return (
              this.posX + this.width - this.offset.right >= MO.posX + MO.offset.left &&
              this.posX + this.offset.left < MO.posX + MO.width - MO.offset.right &&
              this.posY + this.height - this.offset.bottom >= MO.posY + MO.offset.top &&
              this.posY + this.offset.top < MO.posY + MO.height - MO.offset.bottom
          );
      }
      return false;
      
  }

  isCollidingFromAbove(MO) {
    return (
        this.isColliding(MO) &&               // Standardkollision
        this.speedY > 0 &&                    // Charakter fällt nach unten
        this.posY + this.height <= MO.posY    // Charakter ist oberhalb des Gegners
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

      isNotMoving() {
        if (!this.world.keyboard.RIGHT && !this.world.keyboard.LEFT && !this.world.keyboard.UP && !this.isAboveGround()) {
         
            return true;
        } else {
            return false;
        }
      }
    
    

}