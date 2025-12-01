/**
 * Creates and initializes Level 1 of the game.
 * 
 * Level 1 includes:
 * - Background layers (air, third, second, first) repeated across multiple segments
 * - Clouds for dynamic background
 * - Collectable bottles and coins
 * - Enemies (Chicks, Chickens, and the Endboss)
 * - Background music playback
 *
 * Once created, the level is assigned to the global `world` object,
 * the world is set up, and the game starts.
 *
 * @returns {Level} The fully initialized Level 1 instance.
 */
function createLevel1() {

    let level1 = new Level(
        [
            new BackgroundObject('img/5_background/layers/air.png', 0),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),

            new BackgroundObject('img/5_background/layers/air.png', 719),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719),

            new BackgroundObject('img/5_background/layers/air.png', 719 * 2),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719 * 2),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719 * 2),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719 * 2),

            new BackgroundObject('img/5_background/layers/air.png', 719 * 3),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719 * 3),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719 * 3),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719 * 3),

            new BackgroundObject('img/5_background/layers/air.png', 719 * 4),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719 * 4),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719 * 4),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719 * 4),

            new BackgroundObject('img/5_background/layers/air.png', 719 * 5),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719 * 5),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719 * 5),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719 * 5)
        ],
        [
            new Cloud('img/5_background/layers/4_clouds/1.png'),
            new Cloud('img/5_background/layers/4_clouds/1.png'),
            new Cloud('img/5_background/layers/4_clouds/1.png'),
            new Cloud('img/5_background/layers/4_clouds/1.png'),
            new Cloud('img/5_background/layers/4_clouds/1.png'),
        ],
        [
            new CollectableBottle(),
            new CollectableBottle(),
            new CollectableBottle(),
            new CollectableBottle(),
        ],
        [
            new CollectableCoin(),
            new CollectableCoin(),
            new CollectableCoin(),
            new CollectableCoin(),
        ],
        [
            new Chick(),
            new Chick(),
            new Chick(),
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new Endboss(),
        ]
    );

    world.level = level1;
    world.setWorld();
    world.start();
    world.soundManager.playSound('backgroundMusic');
    return level1;
}
