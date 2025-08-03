let canvas;
let world;
let keyboard = new Keyboard();

function init() {
   canvas = document.getElementById('canvas');
   world = new World(canvas, keyboard) // World ist ein Object

}

function loadLevel(levelNumber) {
   document.getElementById('canvas').style.display = 'block';
   document.getElementById('overlay-menu').style.display = 'none';
   world.initiatedGame = true;

   switch (levelNumber) {
      case 0:
         world.level = level0;
         console.log("Level 0 geladen");
         break;
      case 1:
         world.level = createLevel1();
         world.resetStats(); // Reset character and stats when loading level 1
         console.log("Level 1 geladen");
         break;
      case 2:
         world.level = level2;
         console.log("Level 2 geladen");
         break;
      default:
         console.log("Ungültige Levelnummer: " + levelNumber);
   }
}

document.addEventListener('keydown', (event) => { // alternative keypress
   if (event.keyCode == 39 || event.keyCode == 68) { //Arrow Right or D
      keyboard.RIGHT = true
   }

   if (event.keyCode == 37 || event.keyCode == 65) { // arrow Left or A
      keyboard.LEFT = true
   }

   if (event.keyCode == 38 || event.keyCode == 87) { // Arrow Up or W
      keyboard.UP = true
   }

   if (event.keyCode == 32 || event.keyCode == 13) { // Space or Enter
      keyboard.THROW = true
   }

});

document.addEventListener('keyup', (event) => { // alternative keypress
   if (event.keyCode == 39 || event.keyCode == 68) { //Arrow Right or D
      keyboard.RIGHT = false
   }

   if (event.keyCode == 37 || event.keyCode == 65) { // arrow Left or A
      keyboard.LEFT = false
   }

   if (event.keyCode == 38 || event.keyCode == 87) { // Arrow Up or W 
      keyboard.UP = false
   }

   if (event.keyCode == 32 || event.keyCode == 13) { // Space or Enter
      keyboard.THROW = false
   }

});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        world.togglePause();
    }
});

/// ctx.drawImage(character, 20, 20, 50, 150) // 20,20 = Coordinate 50 = Breite 150 = Höhe