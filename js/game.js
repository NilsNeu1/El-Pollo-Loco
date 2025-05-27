let canvas;
let world;
let keyboard = new Keyboard();

function init(){
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard) // World ist ein Object

}

 function loadLevel(levelNumber) {
    document.getElementById('canvas').style.display = 'block';
    document.getElementById('overlay-menu').style.display = 'none';

    switch (levelNumber) {
        case 0:
            world.level = level0;
            console.log("Level 0 geladen");
            break;
        case 1:
            world.level = createLevel1();
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

document.addEventListener('keydown', (event )=>{ // alternative keypress
     if(event.keyCode == 39) { //Arrow Right
        keyboard.RIGHT = true
     }

     if(event.keyCode == 37) { // arrow Left
        keyboard.LEFT = true
     }

     if(event.keyCode == 38) { // Arrow Up 
        keyboard.UP = true
     }

     if(event.keyCode == 32) { // Space
        keyboard.THROW = true
     }

     if(event.keyCode == 13) { // Enter
        keyboard.THROW = true
     }
   // console.log(event);
});

document.addEventListener('keyup', (event )=>{ // alternative keypress
    if(event.keyCode == 39) { //Arrow Right
       keyboard.RIGHT = false
    }

    if(event.keyCode == 37) { // arrow Left
       keyboard.LEFT = false
    }

    if(event.keyCode == 38) { // Arrow Up 
       keyboard.UP = false
    }

    if(event.keyCode == 32) { // Space
       keyboard.THROW = false
    }

    if(event.keyCode == 13) { // Enter
       keyboard.THROW = false
    }
  // console.log(event);
});
 
/// ctx.drawImage(character, 20, 20, 50, 150) // 20,20 = Coordinate 50 = Breite 150 = Höhe