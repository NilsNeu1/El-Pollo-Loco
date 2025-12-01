/**
 * MobileButtons class manages touch-based button controls for mobile devices.
 * Extends DrawableObject to render buttons on the game canvas.
 * Handles orientation changes and touch events for game actions.
 */
class MobileButtons extends DrawableObject {
    /** @type {HTMLElement} - Overlay element shown when device is in portrait mode */
    rotationOverlay;
    /** @type {Function} - Event handler function for orientation changes */
    orientationHandler;

    /** @type {Array<Object>} - Button specifications with position, image, and action mapping */
    buttonSpecs = [
        {
            id: 'left-btn',
            img: 'img/Assets/mobile_buttons/left.png',
            x: 40,
            y: 400,
            action: 'moveLeft'
        },
        {
            id: 'right-btn',
            img: 'img/Assets/mobile_buttons/left.png',
            x: 110,
            y: 400,
            action: 'moveRight',
            rotation: Math.PI / 1
        },
        {
            id: 'jump-btn',
            img: 'img/Assets/mobile_buttons/left.png',
            x: 580,
            y: 400,
            action: 'jump',
            rotation: Math.PI / 2
        },
        {
            id: 'attack-btn',
            img: 'img/Assets/mobile_buttons/bottle.png',
            x: 650,
            y: 400,
            action: 'attack'
        },
        {
            id: 'pause-btn',
            img: 'img/Assets/mobile_buttons/pause.png',
            x: 650,
            y: 30,
            action: 'pause'
        }
    ];
    /** @type {number} - Button width in pixels */
    width = 40;
    /** @type {number} - Button height in pixels */
    height = 40;
    /** @type {HTMLCanvasElement|null} - Game canvas element */
    canvas = null;
    /** @type {World|null} - Game world instance */
    world = null;
    /** @type {Object<string, Image>} - Cache of loaded button images */
    imageCache = {};

    /**
     * Creates a new MobileButtons instance and initializes button images and orientation handling.
     */
    constructor() {
        super();
        this.buttonSpecs.forEach(btn => this.loadImage(btn.img));
        this.posX = 0;
        this.posY = 0;
        this.rotationOverlay = document.getElementById('rotation-overlay');
        this.setupOrientationHandler();
    }

    /**
     * Sets up event listeners for device orientation changes.
     * Monitors resize and orientation change events to update UI visibility.
     */
    setupOrientationHandler() {
        this.checkOrientation();
        this.orientationHandler = () => this.checkOrientation();
        window.addEventListener('resize', this.orientationHandler);
        if (window.screen && window.screen.orientation) {
            window.screen.orientation.addEventListener('change', this.orientationHandler);
        }
    }

    /**
     * Checks the device orientation and displays rotation overlay if needed.
     * Shows overlay in portrait mode on small displays (width < 1370px).
     */
    checkOrientation() {
        const isPortrait = window.innerHeight > window.innerWidth;
        const isSmallDisplay = window.innerWidth < 1370;
        if (this.rotationOverlay) {
            this.rotationOverlay.style.display = (isPortrait && isSmallDisplay) ? 'flex' : 'none';
        }
    }

    /**
     * Sets the canvas and world references and initializes touch event listeners.
     * @param {HTMLCanvasElement} canvas - The game canvas element
     * @param {World} world - The game world instance
     */
    setCanvasAndWorld(canvas, world) {
        this.canvas = canvas;
        this.world = world;
        this.setupButtonTouches();
    }

    /**
     * Loads an image and stores it in the image cache.
     * @param {string} src - The image source path
     */
    loadImage(src) {
        const img = new Image();
        img.src = src;
        this.imageCache[src] = img;
    }

    /**
     * Draws all mobile buttons on the canvas as circular elements with icons.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    draw(ctx) {
        this.buttonSpecs.forEach(btn => {
            ctx.save();
            const centerX = btn.x + this.width / 2;
            const centerY = btn.y + this.height / 2;
            this.drawButtonCircle(ctx, centerX, centerY);
            this.drawButtonIcon(ctx, btn, centerX, centerY);
            ctx.restore();
        });
    }

    /**
     * Draws the circular background for a button.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} centerX
     * @param {number} centerY
     */
    drawButtonCircle(ctx, centerX, centerY) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, this.width / 2, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = '#fff';
        ctx.globalAlpha = 0.7;
        ctx.fill();
        ctx.strokeStyle = '#b76127';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
    }

    /**
     * Draws the icon inside the button if available.
     * @param {CanvasRenderingContext2D} ctx
     * @param {Object} btn - Button spec containing img and rotation
     * @param {number} centerX
     * @param {number} centerY
     */
    drawButtonIcon(ctx, btn, centerX, centerY) {
        const img = this.imageCache[btn.img];
        if (img && img.complete) {
            const rotation = btn.rotation || 0;
            ctx.translate(centerX, centerY);
            ctx.rotate(rotation);
            ctx.drawImage(img, -this.width / 2, -this.height / 2, this.width, this.height);
        }
    }


    /**
     * Calculates the touch position relative to the canvas coordinates.
     * Accounts for canvas scaling differences from display size.
     * @param {Touch} touch - The touch event object
     * @param {HTMLCanvasElement} canvas - The game canvas element
     * @returns {Object} Object with x and y coordinates relative to canvas
     */
    getTouchPos(touch, canvas) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (touch.clientX - rect.left) * scaleX,
            y: (touch.clientY - rect.top) * scaleY
        };
    }

    /**
     * Checks if a touch point is within the circular bounds of a button.
     * @param {number} x - The x coordinate of the touch
     * @param {number} y - The y coordinate of the touch
     * @param {Object} btn - The button object with x, y coordinates
     * @param {number} width - The button width (used to calculate radius)
     * @returns {boolean} True if touch is within button bounds
     */
    isTouchOnButton(x, y, btn, width) {
        const centerX = btn.x + width / 2;
        const centerY = btn.y + width / 2;
        const dist = Math.hypot(x - centerX, y - centerY);
        return dist <= width / 2;
    }

    /**
     * Finds the button at the given coordinates.
     * @param {number} x - The x coordinate to check
     * @param {number} y - The y coordinate to check
     * @param {Array<Object>} buttonSpecs - Array of button specifications
     * @param {number} width - The button width
     * @returns {Object|undefined} The button object if found, undefined otherwise
     */
    findButtonAt(x, y, buttonSpecs, width) {
        return buttonSpecs.find(btn => this.isTouchOnButton(x, y, btn, width));
    }

    /**
     * Handles the touchstart event on the canvas.
     * Identifies which button was touched and triggers the action.
     * @param {TouchEvent} e - The touch event
     * @param {HTMLCanvasElement} canvas - The game canvas element
     * @param {Array<Object>} buttonSpecs - Array of button specifications
     * @param {number} width - The button width
     * @param {Function} setActiveButton - Function to set the active button state
     * @param {Function} handleButtonAction - Function to handle button actions
     */
    handleTouchStart(e, canvas, buttonSpecs, width, setActiveButton, handleButtonAction) {
        const { x, y } = this.getTouchPos(e.touches[0], canvas);
        const btn = this.findButtonAt(x, y, buttonSpecs, width);
        if (btn) {
            setActiveButton(btn.action);
            handleButtonAction(btn.action, true);
        }
    }

    /**
     * Handles the touchend event on the canvas.
     * Releases the active button action (except for pause button).
     * @param {string|null} activeButton - The currently active button action
     * @param {Function} setActiveButton - Function to set the active button state
     * @param {Function} handleButtonAction - Function to handle button actions
     */
    handleTouchEnd(activeButton, setActiveButton, handleButtonAction) {
        if (activeButton && activeButton !== 'pause') {
            handleButtonAction(activeButton, false);
            setActiveButton(null);
        }
    }

    /**
     * Sets up touch event listeners for the canvas.
     * Enables touchstart and touchend handlers for button interaction.
     */
    setupButtonTouches() {
        let activeButton = null;
        const setActiveButton = (val) => { activeButton = val; };
        this.canvas.addEventListener('touchstart', (e) =>
            this.handleTouchStart(e, this.canvas, this.buttonSpecs, this.width, setActiveButton, this.handleButtonAction.bind(this))
        );
        this.canvas.addEventListener('touchend', () =>
            this.handleTouchEnd(activeButton, setActiveButton, this.handleButtonAction.bind(this))
        );
    }

    /**
     * Handles button actions by updating keyboard state or triggering special actions.
     * Maps button actions to keyboard inputs in the world's keyboard object.
     * @param {string} action - The button action (e.g., 'moveLeft', 'jump', 'attack', 'pause')
     * @param {boolean} isPressed - Whether the button is pressed (true) or released (false)
     */
    handleButtonAction(action, isPressed) {
        if (!this.world || !this.world.keyboard) return;
        switch (action) {
            case 'moveLeft':
                this.world.keyboard.LEFT = isPressed;
                break;
            case 'moveRight':
                this.world.keyboard.RIGHT = isPressed;
                break;
            case 'jump':
                this.world.keyboard.UP = isPressed;
                break;
            case 'attack':
                this.world.keyboard.THROW = isPressed;
                break;
            case 'pause':
                this.world.togglePause();
                break;
        }
    }
}