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
    bossBar = new BossBar();
    gameStateUi = new GameStateUI();
    mobileUi = new MobileButtons();
    soundManager = new SoundManager();
    trowable = [];
    availableBottles = this.salsaBar.availableBottles;
    intervalIDs = [];
    initiatedGame = false;
    gamePaused = false;
    gameWon = false;
    bossDefeated = false;
    bossAgro = false;
    bossAgroSoundPlayed = false;
    nextThrowAllowed = 0;
    debugMode = false;

    // um die Variablen aus dieser datei nutzen zu können muss "this." davor gesetzt werden. 

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.gameStateUi = new GameStateUI();
        this.setWorld();
        this.gameStateUi.setCanvasAndWorld(canvas, this); // This sets up button clicks once
        this.mobileUi.setCanvasAndWorld(canvas, this); // This sets up button clicks once
        this.draw();
        this.start();
    }

    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(enemy => enemy.world = this); // Setzt die World-Referenz für Gegner
        this.salsaBar.world = this;
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

    resetStats() {
        this.character.health = 100;
        this.healthBar.setPercentage(this.character.health);
        this.bossBar.setPercentage(100);
        this.character.posX = 100;
        this.character.posY = 180;
        this.salsaBar.availableBottles = 5;
        this.CollectedCoins = 0;
        this.coinBar.CollectedCoins = 0;
        this.camera_x = 0;
        this.bossAgroSoundPlayed = false;
        this.bossAgro = false;

    }


    start() {
        this.initiatedGame = true;
        this.customeInterval(() => {
            this.checkCollisions();
            this.checkThrowObject();
            this.checkCollections();
            this.checkBossAgro();
            this.isGameWon();
            this.smallDisplayUi();
            this.gameStateUi.setupButtonClicks();
        }, 1000 / 60); // Run at 60 FPS for consistent collision detection
        this.gamePaused = false;
        this.gameStateUi.setState('none');
    }

    restartGame() {
        this.resetStats();
        createLevel1();

    }

    togglePause() {
        if (!this.gamePaused) {
            this.clearAllIntervals();
            this.gameStateUi.setState('pause');
        } else {
            this.start();
            this.gameStateUi.setState('none');
        }
    }

    isGameLost() {
        if (this.character.health <= 0) {
            // Stop any background music when the game is lost
            if (this.soundManager) {
                this.soundManager.stopSound('backgroundMusic');
            }
            this.gameStateUi.setState('lose');
            this.clearAllIntervals();
            this.soundManager.playSound('gameOver');
        }
    }

    isGameWon() {
        const boss = this.level.enemies.find(e => e instanceof Endboss);
        if (boss && boss.health <= 0) {
            this.bossDefeated = true;
            // Stop any background music when the game is won
            if (this.soundManager) {
                this.soundManager.stopSound('backgroundMusic');
            }
            this.gameStateUi.setState('win');
            this.clearAllIntervals();
            this.soundManager.playSound('gameWon');
        }
    }

    checkBossAgro() {
        const boss = this.level.enemies.find(e => e instanceof Endboss);
        if (!boss) return;
        let agroRange = Math.abs(this.character.posX - boss.posX);
        if (this.initiatedGame === true && agroRange < 500) {
            this.bossBar.setPercentage(boss.health);
            if (!this.bossAgro && !this.bossAgroSoundPlayed) {
                this.soundManager.playSound('bossAgro');
                this.bossAgroSoundPlayed = true;
            }
            this.bossAgro = true;
        } else if (this.character.posX < 300) {
            this.bossAgro = false;
        }
    }


    checkThrowObject() {
        // Only allow throwing if the THROW key is pressed, bottles are available
        // and the cooldown period has passed.
        const now = Date.now();
        if (this.keyboard.THROW && this.salsaBar.availableBottles > 0 && now >= this.nextThrowAllowed) {
            let bottle = new ThrowableObject(this.character.posX + 100, this.character.posY + 100, this.level);
            this.trowable.push(bottle);
            this.decreaseAvailableBottles();
            this.soundManager.playSound('throw');
            // set 1 second cooldown
            this.nextThrowAllowed = now + 1000;
        }
    }


checkCollisions() {
    const boss = this.level.enemies.find(e => e instanceof Endboss);
    this.level.enemies.forEach((enemy, index) => {
        if (this.character.isColliding(enemy)) {
            if (enemy instanceof Chick || enemy instanceof Chicken || enemy instanceof Endboss) {
                if (this.character.isCollidingFromAbove(enemy)) {
                    if (!(enemy instanceof Endboss)) {
                        if (typeof enemy.hit === 'function') {
                            enemy.hit();
                        } else {
                            enemy.health -= 5;
                        }
                        this.character.jump();
                        this.character.lastHit = new Date().getTime();

                        if (enemy.health <= 5) {
                            enemy.playAnimation(enemy.IMAGES_DEAD);
                            enemy.deadChicken();
                        }
                    } else {
                        this.character.lastHit = new Date().getTime();
                    }
                } else {
                    this.character.hit();
                    this.healthBar.setPercentage(this.character.health);
                    this.bossBar.setPercentage(boss.health);
                    this.isGameLost();
                }
            }
        }

        if (enemy.health <= 1 && enemy.posY > 500) {
            this.level.enemies.splice(index, 1);
        }
    });
}



    checkCollections() {
        this.customeInterval(() => {
            this.level.collectableBottle.forEach((bottle, index) => {
                if (this.character.isColliding(bottle)) {
                    this.salsaBar.availableBottles++;
                    this.level.collectableBottle.splice(index, 1); // Remove the collided bottle from the array
                    this.soundManager.playSound('collectBottle');
                }
            });

            this.level.collectableCoin.forEach((coin, index) => {
                if (this.character.isColliding(coin)) {
                    this.coinBar.CollectedCoins++;
                    this.level.collectableCoin.splice(index, 1); // Remove the collided bottle from the array
                    this.soundManager.playSound('collectCoin');
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
        if (this.debugMode === true) { 
            MO.drawHitbox(this.ctx);
        };
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
        this.addToMap(this.gameStateUi); // Always draw, but image depends on state
        if (this.smallDisplayUi() && this.gameStateUi.state !== 'menu') {
            this.addToMap(this.mobileUi);
        }
        if (this.bossAgro === true && this.gameStateUi.state !== 'menu') {
            this.addToMap(this.bossBar);
        }
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
        console.log('game state', this.gameStateUi.state);
        console.log('Enemies in Level:', this.level.enemies);

    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.canvas.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    smallDisplayUi() {
        return window.innerWidth < 1370
    ;
    }

}
