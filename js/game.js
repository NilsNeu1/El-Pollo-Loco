/**
 * Global reference to the canvas element used for rendering the game.
 * @type {HTMLCanvasElement}
 */
let canvas;

/**
 * The main game world instance, containing levels, state, and logic.
 * @type {World}
 */
let world;

/**
 * Keyboard input handler for managing player controls.
 * @type {Keyboard}
 */
let keyboard = new Keyboard();

/**
 * Manages game sound effects and music, including volume sliders.
 * @type {SoundManager}
 */
let soundManager;

/**
 * Initializes the game by setting up the canvas, world, level, UI state, and sound manager.
 * 
 * @function init
 * @returns {void}
 */
function init() {
   canvas = document.getElementById('canvas');
   world = new World(canvas, keyboard);
   world.level = createLevel1();
   world.clearAllIntervals();
   world.gameStateUi.setState('menu');
   soundManager = new SoundManager();
   soundManager.initSlider();
}

/**
 * Loads a specific level into the game world and resets stats if necessary.
 * 
 * @function loadLevel
 * @param {number} levelNumber - The level index to load (0, 1, or 2).
 * @returns {void}
 */
function loadLevel(levelNumber) {
   document.getElementById('canvas').style.display = 'block';
   document.getElementById('overlay-menu').style.display = 'none';
   world.initiatedGame = true;

   switch (levelNumber) {
      case 0:
         world.level = level0;
         break;
      case 1:
         world.level = createLevel1();
         world.resetStats();
         break;
      case 2:
         world.level = level2;
         break;
      default:
         // No action for undefined levels
   }
}

/**
 * Handles keydown events for player controls.
 * Maps arrow keys and WASD to movement, and Space/Enter to throwing.
 * 
 * @event keydown
 * @param {KeyboardEvent} event - The keydown event object.
 */
document.addEventListener('keydown', (event) => {
   if (event.keyCode == 39 || event.keyCode == 68) { // Arrow Right or D
      keyboard.RIGHT = true;
   }

   if (event.keyCode == 37 || event.keyCode == 65) { // Arrow Left or A
      keyboard.LEFT = true;
   }

   if (event.keyCode == 38 || event.keyCode == 87) { // Arrow Up or W
      keyboard.UP = true;
   }

   if (event.keyCode == 32 || event.keyCode == 13) { // Space or Enter
      keyboard.THROW = true;
   }
});

/**
 * Handles keyup events to stop player actions when keys are released.
 * 
 * @event keyup
 * @param {KeyboardEvent} event - The keyup event object.
 */
document.addEventListener('keyup', (event) => {
   if (event.keyCode == 39 || event.keyCode == 68) { // Arrow Right or D
      keyboard.RIGHT = false;
   }

   if (event.keyCode == 37 || event.keyCode == 65) { // Arrow Left or A
      keyboard.LEFT = false;
   }

   if (event.keyCode == 38 || event.keyCode == 87) { // Arrow Up or W
      keyboard.UP = false;
   }

   if (event.keyCode == 32 || event.keyCode == 13) { // Space or Enter
      keyboard.THROW = false;
   }
});

/**
 * Toggles pause state when Escape key is pressed.
 * 
 * @event keydown
 * @param {KeyboardEvent} event - The keydown event object.
 */
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        world.togglePause();
    }
});

/**
 * Prevents default browser actions for right-click, double-click, and fullscreen changes.
 * 
 * @event contextmenu
 * @event dblclick
 * @event fullscreenchange
 */
document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('dblclick', event => event.preventDefault());
document.addEventListener('fullscreenchange', event => event.preventDefault());
