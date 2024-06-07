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
                clearInterval(this.gravityInterval); // Optional: Beenden des Intervalls, wenn keine Gravitationswirkung mehr nötig ist
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
          //  console.log('not moving');
            return true;
        } else {
            return false;
        }
      }
    

      fallsAsleep() {
        let currentTime = new Date().getTime();
        let asleep = currentTime - this.idleTimer;
    
        if (this.isNotMoving() && asleep >= 3000 ) {
            console.log('not moving since', asleep, 'ms');
            return true;
        } else {
            if (!this.isNotMoving()) {
                console.log('Character is moving');
            } else {
                console.log('Character is idle but not long enough:', asleep, 'ms');
            }
            return false;
        }
    }

    updateIdleTimer() {
        if (this.isNotMoving()) {
            if (!this.idleTimer) {
                this.idleTimer = new Date().getTime();
            }
        } else {
            this.idleTimer = new Date().getTime(); // Reset timer when character starts moving
        }
    }
    
    

}