class Level {
    backgroundObjects;
    clouds;
    collectableBottle;
    collectableCoin;
    enemies;
    gameStateUi;
    level_end_X = 3595;

constructor(backgroundObjects, clouds, collectableBottle, collectableCoin, enemies, gameStateUi){
    this.backgroundObjects = backgroundObjects;
    this.clouds = clouds;
    this.collectableBottle = collectableBottle;
    this.collectableCoin = collectableCoin;
    this.enemies = enemies;
    this.gameStateUi = gameStateUi;
}

}