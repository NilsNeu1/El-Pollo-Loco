/**
 * Generic collectable item in the game world.
 */
class CollectableItem extends MovableObject {
    constructor(imagePath, width, height, offset, posXFn, posYFn) {
        super().loadImage(imagePath);

        this.width = width;
        this.height = height;
        this.offset = offset;

        this.posX = posXFn();
        this.posY = posYFn();
    }

    /**
     * Start periodic checks for collectable collisions; increments counters and plays sounds.
     * Implemented as a static helper that receives the world instance so `this` is the world.
     * @param {World} world - The World instance to use when checking/picking up collectables.
     * @returns {void}
     */
    static checkCollections(world) {
        // Use the world's interval helper so we can track and clear intervals from the world
        world.customeInterval(() => {
            // --- Bottle collisions ---
            world.level.collectableBottle.forEach((bottle, index) => {
                if (world.character.isColliding(bottle)) {
                    world.salsaBar.availableBottles++;
                    world.level.collectableBottle.splice(index, 1); // remove bottle
                    world.soundManager.playSound('collectBottle');
                }
            });

            // --- Coin collisions ---
            world.level.collectableCoin.forEach((coin, index) => {
                if (world.character.isColliding(coin)) {
                    world.coinBar.CollectedCoins++;
                    world.level.collectableCoin.splice(index, 1); // remove coin
                    world.soundManager.playSound('collectCoin');
                }
            });
        }, 1000);
    }
}

/** Coin collectable */
class CollectableCoin extends CollectableItem {
    constructor() {
        super(
            'img/8_coin/coin_1.png',
            150,
            150,
            { top: 50, bottom: 50, left: 50, right: 50 },
            () => 400 + Math.random() * 1500,
            () => 150 - Math.random() * 100
        );
    }
}

/** Salsa bottle collectable */
class CollectableBottle extends CollectableItem {
    constructor() {
        super(
            'img/6_salsa_bottle/2_salsa_bottle_on_ground.png',
            100,
            100,
            { top: 20, bottom: 10, left: 35, right: 25 },
            () => 400 + Math.random() * 1000,
            () => 350
        );
    }
}

/**
 * Start periodic checks for collectable collisions; increments counters and plays sounds.
 * Implemented as a static helper that receives the world instance so `this` is the world.
 * @param {World} world - The World instance to use when checking/picking up collectables.
 * @returns {void}
 */
// (The static method is defined on CollectableItem class above, so we originally removed the duplicate declaration here.)

