/**
 * Represents a game level configuration.
 * Holds references to background objects, clouds, collectables, enemies,
 * and UI elements that define the state and layout of the level.
 */
class Level {

    /** @type {DrawableObject[]} Background objects for the level (e.g., scenery, terrain) */
    backgroundObjects;

    /** @type {Cloud[]} Clouds that appear in the level’s background */
    clouds;

    /** @type {CollectableBottle[]} Collectable bottles available in the level */
    collectableBottle;

    /** @type {CollectableCoin[]} Collectable coins available in the level */
    collectableCoin;

    /** @type {(Chick|Chicken|Endboss)[]} Enemies present in the level */
    enemies;

    /** @type {DrawableObject[]} UI elements for displaying game state (e.g., health bar, coin bar) */
    gameStateUi;

    /** @type {number} X-coordinate marking the end of the level */
    level_end_X = 3595;

    /**
     * Creates a new Level instance.
     *
     * @param {DrawableObject[]} backgroundObjects - Background objects for the level.
     * @param {Cloud[]} clouds - Clouds in the level’s background.
     * @param {CollectableBottle[]} collectableBottle - Collectable bottles in the level.
     * @param {CollectableCoin[]} collectableCoin - Collectable coins in the level.
     * @param {(Chick|Chicken|Endboss)[]} enemies - Enemies in the level.
     * @param {DrawableObject[]} gameStateUi - UI elements for displaying game state.
     */
    constructor(backgroundObjects, clouds, collectableBottle, collectableCoin, enemies, gameStateUi) {
        this.backgroundObjects = backgroundObjects;
        this.clouds = clouds;
        this.collectableBottle = collectableBottle;
        this.collectableCoin = collectableCoin;
        this.enemies = enemies;
        this.gameStateUi = gameStateUi;
    }
}
