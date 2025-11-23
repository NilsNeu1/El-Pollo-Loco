/**
 * GameStateUI - Manages the user interface for different game states.
 * Extends DrawableObject to handle rendering of UI screens and interactive buttons.
 * 
 * @class GameStateUI
 * @extends DrawableObject
 * 
 * @property {number} width - Canvas width (720px)
 * @property {number} height - Canvas height (480px)
 * @property {string[]} startUi - Image paths for start screen
 * @property {string[]} winUi - Image paths for win screen
 * @property {string[]} loseUi - Image paths for lose screen
 * @property {string} state - Current UI state: 'none', 'win', 'lose', 'pause', or 'menu'
 * @property {Image[]} imageCache - Cache for loaded UI images
 * @property {Object[]} buttonSpecs - Array of button specification objects
 * @property {boolean} buttonSpecsLoaded - Flag indicating if button specs are loaded
 * @property {Promise|null} loadButtonSpecsPromise - Promise for loading button specs
 * @property {HTMLCanvasElement|null} canvas - Reference to the canvas element
 * @property {World|null} world - Reference to the world/game state object
 * @property {Object} buttonImageCache - Cache for button images
 */
class GameStateUI extends DrawableObject {

    width = 720;
    height = 480;
    startUi = ['img/9_intro_outro_screens/start/startscreen_1.png'];
    winUi = ['img/9_intro_outro_screens/game-won/You Win A.png'];
    loseUi = ['img/9_intro_outro_screens/game_over/game over.png'];
    state = 'menu'; // 'none', 'win', 'lose', 'pause', 'menu'
    imageCache = [];
    buttonSpecs = [];
    buttonSpecsLoaded = false;
    loadButtonSpecsPromise = null;
    canvas = null;
    world = null;
    buttonImageCache = {};

    /**
     * Constructor - Initializes the GameStateUI with UI screens and button specs.
     * Loads all UI images and fetches button specifications from JSON file.
     */
    constructor(){
        super().loadImage('img/9_intro_outro_screens/start/startscreen_1.png');
        this.loadImages(this.winUi);
        this.loadImages(this.loseUi);
        this.loadImages(this.startUi);
        this.posX = 0;
        this.posY = 0;
        this.clickHandler = null;
        this.loadButtonSpecs();
    }

    /**
     * Sets up the canvas and world references, and initializes button click handlers.
     * 
     * @param {HTMLCanvasElement} canvas - The canvas element to render on
     * @param {World} world - The game world/state object
     */
    setCanvasAndWorld(canvas, world) {
        this.canvas = canvas;
        this.world = world;
        if (this.loadButtonSpecsPromise) {
            this.loadButtonSpecsPromise.then(() => this.setupButtonClicks());
        } else {
            this.setupButtonClicks();
        }
    }

    /**
     * Preloads all button images into the cache for faster rendering.
     * Iterates through button specs and creates Image objects for each.
     */
    preloadButtonImages() {
        this.buttonSpecs.forEach(btn => {
            if (btn.img) {
                const img = new Image();
                img.src = btn.img;
                this.buttonImageCache[btn.id] = img;
            }
        });
    }

    /**
     * Asynchronously loads button specifications from buttonSpecs.json.
     * Uses caching to prevent multiple fetches of the same data.
     * 
     * @returns {Promise<void>} Promise that resolves when button specs are loaded
     */
    loadButtonSpecs() {
        if (this.loadButtonSpecsPromise) return this.loadButtonSpecsPromise;
        this.loadButtonSpecsPromise = fetch('js/buttonSpecs.json')
            .then(response => {
                if (!response.ok) throw new Error('Failed to load buttonSpecs.json');
                return response.json();
            })
            .then(data => {
                this.buttonSpecs = data || [];
                this.preloadButtonImages();
                this.buttonSpecsLoaded = true;
            })
            .catch(err => {
                console.error('Error loading button specs:', err);
            });

        return this.loadButtonSpecsPromise;
    }

    /**
     * Sets the current UI state and updates the displayed image accordingly.
     * 
     * @param {string} state - The new state ('menu', 'pause', 'win', 'lose', 'none')
     */
    setState(state) {
        this.state = state;
        if (state === 'win') {
            this.img = this.imageCache[this.winUi];
        } else if (state === 'lose') {
            this.img = this.imageCache[this.loseUi];
        } else if (state === 'menu') {
            this.img = this.imageCache[this.startUi];
        }
    }

    /**
     * Draws the UI to the canvas based on the current state.
     * Renders the background image and buttons when appropriate.
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    draw(ctx) {
        if (['win', 'lose', 'menu'].includes(this.state)) {
            ctx.drawImage(this.img, this.posX, this.posY, this.width, this.height);
        }
        if (['pause', 'win', 'lose', 'menu'].includes(this.state)) {
            this.drawButtons(ctx);
        }
    }

    /**
     * Draws all visible buttons for the current state.
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    drawButtons(ctx) {
    const buttonsToDraw = this.getButtonsToDraw();
    this.renderButtons(ctx, buttonsToDraw);
}

/**
 * Determines which buttons should be displayed based on the current state.
 * 
 * @returns {Object[]} Array of button specifications to draw
 */
getButtonsToDraw() {
    switch (this.state) {
        case 'win':
        case 'lose':
            return this.getWinLoseButtons();

        case 'pause':
        case 'none':
            return this.getPauseButtons();

        case 'menu':
            return this.getMenuButtons();

        default:
            return [];
    }
}

/**
 * Gets button specifications for win/lose states.
 * Modifies the 'Try Again' button position and visibility.
 * 
 * @returns {Object[]} Array of button specifications for win/lose screens
 */
getWinLoseButtons() {
    const loadLevelBtn = this.buttonSpecs.find(btn => btn.id === 'load-level-btn');
    const buttonsToDraw = this.buttonSpecs.filter(btn =>
        ['load-level-btn', 'fullscreen-btn', 'to-menu-btn'].includes(btn.id)
    );

    if (loadLevelBtn) {
        Object.assign(loadLevelBtn, {
            text: 'Try Again',
            y: 420,
            x: 180
        });
    }

    return buttonsToDraw;
}

/**
 * Gets button specifications for pause menu.
 * Includes volume controls and updates volume display in real-time.
 * 
 * @returns {Object[]} Array of button specifications for pause menu
 */
getPauseButtons() {
    const buttonsToDraw = this.buttonSpecs.filter(btn =>
        ['resume-btn', 'restart-btn', 'fullscreen-btn', 'volume-up-btn', 'volume-display-btn', 'volume-down-btn'].includes(btn.id)
    );

    const volumeDisplayBtn = buttonsToDraw.find(btn => btn.id === 'volume-display-btn');
    if (volumeDisplayBtn && this.world && this.world.soundManager) {
        volumeDisplayBtn.text = Math.round(this.world.soundManager.volume * 100);
    }

    return buttonsToDraw;
}

/**
 * Gets button specifications for main menu state.
 * Modifies the 'Play Demo' button position and visibility.
 * 
 * @returns {Object[]} Array of button specifications for menu screen
 */
getMenuButtons() {
    const loadLevelBtn = this.buttonSpecs.find(btn => btn.id === 'load-level-btn');
    const buttonsToDraw = this.buttonSpecs.filter(btn =>
        ['load-level-btn', 'impressum-btn'].includes(btn.id)
    );

    if (loadLevelBtn) {
        Object.assign(loadLevelBtn, {
            text: 'Play Demo',
            y: 420,
            x: 285
        });
    }

    return buttonsToDraw;
}


/**
 * Renders the given buttons to the canvas.
 * Handles background, border, image, and text rendering for each button.
 * 
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
 * @param {Object[]} buttonsToDraw - Array of button specifications to render
 */
renderButtons(ctx, buttonsToDraw) {
    buttonsToDraw.forEach(btn => {
        ctx.fillStyle = btn.bg;
        if (btn.bg !== 'none') {
            ctx.fillRect(btn.x, btn.y, btn.width, btn.height);
        }

        ctx.strokeStyle = btn.border;
        ctx.lineWidth = 3;
        ctx.strokeRect(btn.x, btn.y, btn.width, btn.height);

        if (btn.img && this.buttonImageCache[btn.id]?.complete) {
            ctx.drawImage(this.buttonImageCache[btn.id], btn.x, btn.y, btn.width, btn.height);
        }
        
        this.impressumBtn(ctx, btn);
    });
}

/**
 * Renders button text to the canvas with appropriate styling.
 * Uses different font sizes for the impressum button.
 * 
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
 * @param {Object} btn - The button specification containing text and styling properties
 */
impressumBtn(ctx, btn) {
        ctx.fillStyle = btn.color;
        ctx.font = btn.id === 'impressum-btn' ? 'bold 12px Arial' : 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(btn.text, btn.x + btn.width / 2, btn.y + btn.height / 2);
}


/**
 * Sets up click event listeners on the canvas for button interactions.
 * Only processes clicks when UI is visible (pause, win, lose, menu states).
 * Removes any existing click handlers before adding new ones.
 */
setupButtonClicks() {
    if (!this.canvas) return;
    this.removeClickHandler();

    this.clickHandler = (e) => {
        if (!['pause', 'win', 'lose', 'menu'].includes(this.state)) return;
        const { mouseX, mouseY } = this.getMousePosition(e);
        const visibleButtons = this.getVisibleButtons();
        this.handleButtonClick(mouseX, mouseY, visibleButtons);
    };

    this.canvas.addEventListener('click', this.clickHandler);
}

/**
 * Removes the click event listener from the canvas.
 * Clears the stored clickHandler reference.
 */
removeClickHandler() {
    if (this.clickHandler) {
        this.canvas.removeEventListener('click', this.clickHandler);
        this.clickHandler = null;
    }
}

/**
 * Calculates mouse position relative to the canvas accounting for scaling.
 * 
 * @param {MouseEvent} e - The mouse event
 * @returns {Object} Object containing mouseX and mouseY coordinates
 */
getMousePosition(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    return {
        mouseX: (e.clientX - rect.left) * scaleX,
        mouseY: (e.clientY - rect.top) * scaleY
    };
}

/**
 * Gets the list of visible/clickable buttons for the current state.
 * 
 * @returns {Object[]} Array of visible button specifications
 */
getVisibleButtons() {
    if (['win', 'lose'].includes(this.state)) {
        return this.buttonSpecs.filter(btn =>
            ['load-level-btn', 'to-menu-btn', 'fullscreen-btn'].includes(btn.id)
        );
    }
    if (this.state === 'menu') {
        return this.buttonSpecs.filter(btn =>
            ['load-level-btn', 'impressum-btn'].includes(btn.id)
        );
    }
    if (['pause', 'none'].includes(this.state)) {
        return this.buttonSpecs.filter(btn =>
            ['resume-btn', 'restart-btn', 'fullscreen-btn',
             'volume-up-btn', 'volume-display-btn', 'volume-down-btn'].includes(btn.id)
        );
    }
    return [];
}

/**
 * Checks if a click is within any visible button and executes the corresponding action.
 * 
 * @param {number} mouseX - The X coordinate of the click
 * @param {number} mouseY - The Y coordinate of the click
 * @param {Object[]} visibleButtons - Array of visible button specifications
 */
handleButtonClick(mouseX, mouseY, visibleButtons) {
    for (const btn of visibleButtons) {
        if (
            mouseX >= btn.x && mouseX <= btn.x + btn.width &&
            mouseY >= btn.y && mouseY <= btn.y + btn.height
        ) {
            this.executeButtonAction(btn.id);
            break;
        }
    }
}

/**
 * Executes the action associated with a button ID.
 * Uses a lookup object to safely call the appropriate method.
 * 
 * @param {string} id - The button ID identifying which action to execute
 */
executeButtonAction(id) {
    const actions = {
        'restart-btn': () => this.restartGame(),
        'resume-btn': () => this.world.togglePause(),
        'load-level-btn': () => this.world.restartGame(),
        'to-menu-btn': () => this.goToMenu(),
        'fullscreen-btn': () => this.world.toggleFullscreen(),
        'impressum-btn': () => this.openImpressum(),
        'volume-up-btn': () => this.adjustVolume(0.1),
        'volume-down-btn': () => this.adjustVolume(-0.1)
    };

    actions[id]?.(); // safely call if action exists
}

/**
 * Restarts the game by clearing the UI state and resetting the game world.
 */
restartGame() {
    this.setState('none');
    this.world.restartGame();
}

/**
 * Returns to the main menu by reloading the level and changing the UI state.
 * Clears all game intervals before returning to menu.
 */
goToMenu() {
    this.world.level = createLevel1();
    this.world.clearAllIntervals();
    this.setState('menu');
}

/**
 * Opens the impressum/legal information page in a new browser window.
 */
openImpressum() {
    window.open('impressum.html', '_blank');
}

/**
 * Adjusts the game volume by a specified delta amount.
 * Constrains the volume to be between 0 and 1.
 * 
 * @param {number} delta - The amount to adjust volume by (can be positive or negative)
 */
adjustVolume(delta) {
    if (this.world?.soundManager) {
        const newVolume = Math.max(
            0,
            Math.min(1, this.world.soundManager.volume + delta)
        );
        this.world.soundManager.setVolume(newVolume);
    }
}

}