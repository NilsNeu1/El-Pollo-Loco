class World {

    character = new Character();  // erstellt einen neuen charackter in der Welt // Character erbt variablen u eigenschaften von movable object
    level = level0;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    healthBar = new HealthBar();
    salsaBar = new SalsaBar();
    coinBar = new CoinBar();
    trowable = [];
    availableBottles = this.salsaBar.availableBottles;
    intervalIDs = [];
    gamePaused = false;

    // um die Variablen aus dieser datei nutzen zu können muss "this." davor gesetzt werden. 

    constructor(canvas, keyboard) { // canvas ist die variable die zuvor in game.js definiert wurde
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas; // (Canvas links) greift auf das globale canvas zu. = canvas importiert das globale canvas in diese function.
        this.keyboard = keyboard;
        this.intervalIDs;
        this.gamePaused = false;
        this.draw();
        this.setWorld();
        this.start();
    }

    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(enemy => enemy.world = this); // Setzt die World-Referenz für Gegner
    }


    customeInterval(callback, interval) {
        let id = setInterval(callback, interval);
        this.intervalIDs.push(id);

    }

    clearAllIntervals() {
        this.intervalIDs.forEach(id => clearInterval(id));
        this.intervalIDs = []; // Liste der gespeicherten Intervalle leeren
        this.gamePaused = true;
    }


    start() {
        this.customeInterval(() => {
            this.checkCollisions();
            this.checkThrowObject();
            this.checkCollections();
        }, 200);
        this.gamePaused = false;
    }

togglePause() {
    if (!this.gamePaused) {
        this.clearAllIntervals();
        document.getElementById('overlay-menu').style.display = 'block';
        document.getElementById('canvas').style.display = 'none';
    } else {
        this.start();
        document.getElementById('overlay-menu').style.display = 'none';
        document.getElementById('canvas').style.display = 'block';
    }
}

    checkThrowObject() {
        if (this.keyboard.THROW && this.salsaBar.availableBottles > 0) {
            let bottle = new ThrowableObject(this.character.posX + 100, this.character.posY + 100, this.level);
            this.trowable.push(bottle);
            this.decreaseAvailableBottles();
        }
    }


    checkCollisions() {
        this.customeInterval(() => {
            this.level.enemies.forEach((enemy) => {
                if (this.character.isColliding(enemy)) {
                    if (enemy instanceof Chick || enemy instanceof Chicken || enemy instanceof Endboss) {
                        if (this.character.isCollidingFromAbove(enemy)) {
                            enemy.health -= 5;
                            this.character.jump();

                            if (enemy.health <= 5) {
                                enemy.playAnimation(enemy.IMAGES_DEAD);
                                enemy.deadChicken();
                            }
                        } else {
                            this.character.hit();
                            this.healthBar.setPercentage(this.character.health);
                        }
                    }
                }
            });
        }, 1000 / 60); // Kollisionsprüfung alle 60 fps
    }


    checkCollections() {
        this.customeInterval(() => {
            this.level.collectableBottle.forEach((bottle, index) => {
                if (this.character.isColliding(bottle)) {
                    this.salsaBar.availableBottles++;
                    this.level.collectableBottle.splice(index, 1); // Remove the collided bottle from the array
                }
            });

            this.level.collectableCoin.forEach((coin, index) => {
                if (this.character.isColliding(coin)) {
                    this.coinBar.CollectedCoins++;
                    this.level.collectableCoin.splice(index, 1); // Remove the collided bottle from the array
                }
            });

        }, 1000);
    }




    draw() { // wird so oft aufgerufen wie für die Grafikkarte möglich
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // cleared das Canvas bevor etwas neues gezeichent wird


        if (this.level != level0) {
            this.ctx.translate(this.camera_x, 0); // verschiebt die Kamera nach links

            this.addObjectToMap(this.level.backgroundObjects);
            this.addObjectToMap(this.level.clouds);
            this.addObjectToMap(this.level.collectableBottle);
            this.addObjectToMap(this.level.collectableCoin);
            this.addObjectToMap(this.level.enemies);
            this.addToMap(this.character);
            this.addObjectToMap(this.trowable);

            //--------------------fixierte objecte-------------------- //
            this.ctx.translate(-this.camera_x, 0);
            this.staticObjects(this.ctx);
            this.ctx.translate(this.camera_x, 0);
            //--------------------fixierte objecte-------------------- //
            this.ctx.translate(-this.camera_x, 0); // macht das Translate wieder Rückgängig
        } else { this.addObjectToMap(this.level.backgroundObjects); } // das einzige objekt, dass immer geladen werden muss0

        let self = this; // function kennt "this" nicht mehr und muss daswegen ausßerhalb neu definiert werden.
        requestAnimationFrame(function () { // == requestAnimationFrame(this.draw)
            self.draw();
        });
    }

    addObjectToMap(objects) {
        objects.forEach(obj => {
            this.addToMap(obj);
        });
    }

    addToMap(MO) {
        if (MO.otherDirection) { //spiegelt das MO um in andere richtungen gehen zu können
            this.flipImage(MO);
        }
        MO.draw(this.ctx);
        MO.drawHitbox(this.ctx);

        if (MO.otherDirection) {
            this.flipImageBack(MO)
        }

    }

    staticObjects(ctx) {
        this.addToMap(this.healthBar);
        this.addToMap(this.salsaBar);
        this.salsaBar.drawCounter(this.ctx);
        this.addToMap(this.coinBar);
        this.coinBar.drawCounter(this.ctx);
        //    this.addToMap(this.bossBar);
    }


    flipImage(MO) {
        this.ctx.save();
        this.ctx.translate(MO.width, 0);
        this.ctx.scale(-1, 1);
        MO.posX = MO.posX * -1;
    }

    flipImageBack(MO) {
        MO.posX = MO.posX * -1;
        this.ctx.restore();
    }

    decreaseAvailableBottles() {
        if (this.salsaBar.availableBottles > 0) {
            this.salsaBar.availableBottles--;
        }
        return this.salsaBar.availableBottles;
    }

    debug() {
        console.log('gamePaused:', this.gamePaused);
        console.log('Enemies in Level:', this.level.enemies);

    }

}
