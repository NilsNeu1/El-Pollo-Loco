/**
 * The main game world containing the player, level and all game systems.
 *
 * Links to related classes used by the world:
 * @see {@link Character} - `models/character.class.js`
 * @see {@link Level} - `models/level.class.js`
 * @see {@link ThrowableObject} - `models/throwable-object.class.js`
 * @see {@link Endboss} - `models/endboss.class.js`
 * @see {@link Chick} - `models/chick.class.js`
 * @see {@link Chicken} - `models/chicken.class.js`
 * @see {@link StatCounter} - `models/statCounter.class.js`
 * @see {@link Healthbars} - `models/healthbars.class.js`
 * @see {@link BossBar} - `models/healthbars.class.js`
 * @see {@link GameStateUI} - `models/gameStateUi.class.js`
 * @see {@link MobileButtons} - `models/mobile-ui.class.js`
 * @see {@link SoundManager} - `models/sound-manager.class.js`
 *
 * @class World
 */
class World {

    character = new Character();  // erstellt einen neuen charackter in der Welt // Character erbt variablen u eigenschaften von movable object
    level = level0;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    healthbars;
    salsaBar = new SalsaBar();
    coinBar = new CoinBar();
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
    enableSounds = false;

    // um die Variablen aus dieser datei nutzen zu können muss "this." davor gesetzt werden. 
    
    /**
     * Initialize the world with a rendering canvas and input handler.
     * @param {HTMLCanvasElement} canvas - Canvas element used for rendering.
     * @param {Keyboard} keyboard - Keyboard/mobile input handler.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.healthbars = new Healthbars(this);
        this.gameStateUi = new GameStateUI();
        this.setWorld();
        this.gameStateUi.setCanvasAndWorld(canvas, this); // This sets up button clicks once
        this.mobileUi.setCanvasAndWorld(canvas, this); // This sets up button clicks once
        this.draw();
        this.start();
    }

    /**
     * Attach this world instance to contained objects so they can reference it.
     * @returns {void}
     */
    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(enemy => enemy.world = this); // Setzt die World-Referenz für Gegner
        this.salsaBar.world = this;
        // attach world reference to healthbars manager and its children
        if (this.healthbars) {
            this.healthbars.world = this;
            if (this.healthbars.playerBar) this.healthbars.playerBar.world = this;
            if (this.healthbars.bossBar) this.healthbars.bossBar.world = this;
        }
    }


    /**
     * Wrapper for setInterval which tracks interval IDs so they can be cleared later.
     * @param {Function} callback - Callback to run on each tick.
     * @param {number} interval - Interval in milliseconds.
     * @returns {number} The interval id returned by setInterval.
     */
    customeInterval(callback, interval) {
        let id = setInterval(callback, interval);
        this.intervalIDs.push(id);

        return id;

    }

    /**
     * Clear every interval created via {@link World#customeInterval} and pause the game.
     * @returns {void}
     */
    clearAllIntervals() {
        this.intervalIDs.forEach(id => clearInterval(id));
        this.intervalIDs = []; // Liste der gespeicherten Intervalle leeren
        this.gamePaused = true;
    }

    /**
     * Reset player and world statistics (health, position, UI counters, camera, etc.).
     * @returns {void}
     */
    resetStats() {
        this.character.health = 100;
        this.healthbars.setPlayerPercentage(this.character.health);
        this.healthbars.setBossPercentage(100);
        this.character.posX = 100;
        this.character.posY = 180;
        this.salsaBar.availableBottles = 5;
        this.CollectedCoins = 0;
        this.coinBar.CollectedCoins = 0;
        this.camera_x = 0;
        this.bossAgroSoundPlayed = false;
        this.bossAgro = false;

    }


    /**
     * Start the main update loop for periodic checks (collisions, collections, boss state).
     * @returns {void}
     */
    start() {
        this.initiatedGame = true;
        this.customeInterval(() => {
            if (typeof this.character.checkCollisions === 'function') this.character.checkCollisions();
            this.checkThrowObject();
            CollectableItem.checkCollections(this);
            this.checkBossAgro();
            this.isGameWon();
            this.gameStateUi.setupButtonClicks();
        }, 1000 / 60); // Run at 60 FPS for consistent collision detection
        this.gamePaused = false;
        this.gameStateUi.setState('none');
    }

    /**
     * Restart the game: reset stats and create the first level.
     * @returns {void}
     */
    restartGame() {
        this.enableSounds = true;
        this.resetStats();
        createLevel1();

    }

    /**
     * Toggle the paused state of the game.
     * @returns {void}
     */
    togglePause() {
        if (!this.gamePaused) {
            this.clearAllIntervals();
            this.gameStateUi.setState('pause');
        } else {
            this.start();
            this.gameStateUi.setState('none');
        }
    }

    /**
     * Check if the player lost (health <= 0) and handle end-of-game actions.
     * @returns {void}
     */
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

    /**
     * Check whether the boss has been defeated and handle win actions.
     * @returns {void}
     */
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

    /**
     * Update boss agro state depending on player proximity and play agro sound once.
     * @returns {void}
     */
    checkBossAgro() {
        const boss = this.level.enemies.find(e => e instanceof Endboss);
        if (!boss) return;
        let agroRange = Math.abs(this.character.posX - boss.posX);
            if (this.initiatedGame === true && agroRange < 500) {
            this.healthbars.setBossPercentage(boss.health);
            if (!this.bossAgro && !this.bossAgroSoundPlayed) {
                this.soundManager.playSound('bossAgro');
                this.bossAgroSoundPlayed = true;
            }
            this.bossAgro = true;
        } else if (this.character.posX < 300) {
            this.bossAgro = false;
        }
    }


    /**
     * Create and throw a bottle if input and cooldown allow.
     * @returns {void}
     */
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

    /**
     * Main draw loop, called as often as the GPU allows.
     */
    draw() {
        this.clearCanvas();

        if (this.level !== level0) {
            this.renderDynamicScene();
        } else {
            this.renderBackgroundOnly();
        }

        this.scheduleNextFrame();
    }

    /**
     * Clears the canvas before drawing.
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Render all moving and fixed objects with camera translation.
     */
    renderDynamicScene() {
        this.ctx.translate(this.camera_x, 0);

        this.addObjectToMap(this.level.backgroundObjects);
        this.addObjectToMap(this.level.clouds);
        this.addObjectToMap(this.level.collectableBottle);
        this.addObjectToMap(this.level.collectableCoin);
        this.addObjectToMap(this.level.enemies);
        this.addToMap(this.character);
        this.addObjectToMap(this.trowable);

        this.renderStaticObjects();

        this.ctx.translate(-this.camera_x, 0); // reset translation
    }

    /**
     * Render static objects (UI, HUD, etc.).
     */
    renderStaticObjects() {
        this.ctx.translate(-this.camera_x, 0);
        this.staticObjects(this.ctx);
        this.ctx.translate(this.camera_x, 0);
    }

    /**
     * Render only background objects (used for level0).
     */
    renderBackgroundOnly() {
        this.addObjectToMap(this.level.backgroundObjects);
    }

    /**
     * Schedule the next frame using requestAnimationFrame.
     */
    scheduleNextFrame() {
        requestAnimationFrame(() => this.draw());
    }


    /**
     * Draw multiple drawable objects by delegating to {@link World#addToMap}.
     * @param {Array<DrawableObject>} objects - Array of drawable objects.
     * @returns {void}
     */
    addObjectToMap(objects) {
        objects.forEach(obj => {
            this.addToMap(obj);
        });
    }

    /**
     * Draw a single movable/drawable object and its hitbox (when debug mode enabled).
     * Handles horizontal mirroring for objects that face the other direction.
     * @param {DrawableObject} MO - The object to draw (must implement draw(ctx)).
     * @returns {void}
     */
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

    /**
     * Draw UI and other screen-space/static objects (drawn without camera translation).
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context (kept for signature compatibility).
     * @returns {void}
     */
    staticObjects(ctx) {
        this.addToMap(this.healthbars);
        this.addToMap(this.salsaBar);
        this.salsaBar.drawCounter(this.ctx);
        this.addToMap(this.coinBar);
        this.coinBar.drawCounter(this.ctx);
        this.addToMap(this.gameStateUi); // Always draw, but image depends on state
        if ((navigator.maxTouchPoints > 0) && this.gameStateUi.state !== 'menu') {
            this.addToMap(this.mobileUi);
        }
        // Boss bar drawing is handled inside the Healthbars manager (only drawn when bossAgro is true).
    }


    /**
     * Flip the canvas horizontally to render a mirrored object and adjust its x position.
     * @param {DrawableObject} MO - Object to flip; expected to have `width` and `posX`.
     * @returns {void}
     */
    flipImage(MO) {
        this.ctx.save();
        this.ctx.translate(MO.width, 0);
        this.ctx.scale(-1, 1);
        MO.posX = MO.posX * -1;
    }

    /**
     * Restore canvas state after a horizontal flip and revert the object's x adjustment.
     * @param {DrawableObject} MO - Previously flipped object.
     * @returns {void}
     */
    flipImageBack(MO) {
        MO.posX = MO.posX * -1;
        this.ctx.restore();
    }

    /**
     * Decrease the available salsa bottles by one (if any) and return the remaining count.
     * @returns {number} Remaining number of available bottles.
     */
    decreaseAvailableBottles() {
        if (this.salsaBar.availableBottles > 0) {
            this.salsaBar.availableBottles--;
        }
        return this.salsaBar.availableBottles;
    }

    /**
     * Toggle browser fullscreen mode for the game canvas.
     * @returns {void}
     */
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.canvas.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

}
