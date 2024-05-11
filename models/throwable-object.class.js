class ThrowableObject extends MovableObject {

    IMAGES_ROTATE = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
    ];
    IMAGES_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
    ]

    constructor(x, y){
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.IMAGES_ROTATE);
        this.loadImages(this.IMAGES_SPLASH);
        this.posX = x;
        this.posY = y;
        this.height = 100;
        this.width = 100;
        this.level = level1;
        this.throw();
        
    }

    throw() {
        this.speedY = 7;
        this.gravityInterval = this.applyGravity(); // Speichern der Interval-ID von applyGravity
    
        let moveInterval = setInterval(() => {
            this.posX += 8;
            this.level.enemies.forEach(enemy => {
                if (this.isColliding(enemy)) {
                    clearInterval(moveInterval);
                    clearInterval(rotateInterval);
                    clearInterval(this.gravityInterval); // Beenden des Schwerkraft-Intervalls
                    this.splash(); // Aufruf von splash bei einer Kollision
                }
            });
        }, 10);
    
        let rotateInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_ROTATE);
        }, 80);
    }

    splash() {
        let splashCount = 0;
        let splashInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_SPLASH[splashCount]);
            splashCount++;

            if (splashCount >= this.IMAGES_SPLASH.length) {
                clearInterval(splashInterval); // Clear the interval
            }
        }, 80);
    }
}