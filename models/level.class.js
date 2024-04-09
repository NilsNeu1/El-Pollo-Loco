class Level {
    enemies;
    clouds;
    backgroundObjects;
    collectableBottle;
    level_end_X = 2100;

constructor(enemies, clouds, backgroundObjects, collectableBottle){
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.collectableBottle = collectableBottle;
}

}