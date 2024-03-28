class ThrowableObject extends MovableObject {

    constructor(x, y){
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.posX = x;
        this.posY = y;
        this.height = 100;
        this.width = 100;
        this.throw();
    }

    throw() {
        this.speedY = 7;
        this.applyGravity();

        setInterval(() => {
            this.posX += 8;
        }, 10);

    }

}