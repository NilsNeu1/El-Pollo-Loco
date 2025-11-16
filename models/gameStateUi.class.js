class GameStateUI extends DrawableObject {

    width = 720;
    height = 480;
    startUi = ['img/9_intro_outro_screens/start/startscreen_1.png'];
    winUi = ['img/9_intro_outro_screens/game-won/You Win A.png'];
    loseUi = ['img/9_intro_outro_screens/game_over/game over.png'];
    state = 'menu'; // 'none', 'win', 'lose', 'pause', 'menu'
    imageCache = [];
    buttonSpecs = [
        {
            id: 'restart-btn',
            text: 'Restart',
            x: 180,
            y: 420,
            width: 150,
            height: 40,
            bg: '#994509d6',
            border: '#b76127',
            color: '#ff9e00'
        },
         {
            id: 'load-level-btn',
            text: 'Try Again',
            x: 285,
            y: 420,
            width: 150,
            height: 40,
            bg: '#994509d6',
            border: '#b76127',
            color: '#ff9e00'
        },
        {
            id: 'resume-btn',
            text: 'Resume',
            x: 390,
            y: 420,
            width: 150,
            height: 40,
            bg: '#994509d6',
            border: '#b76127',
            color: '#ff9e00'
        },
        {
            id: 'fullscreen-btn',
            text: '',
            img: 'img/Assets/expand.png',
            x: 685,
            y: 10,
            width: 20,
            height: 20,
            bg: '#994509d6',
            border: '#b76127',
            color: 'black'
        },
        {
            id: 'to-menu-btn',
            text: 'To Menu',
            img: '',
            x: 390,
            y: 420,
            width: 150,
            height: 40,
            bg: '#994509d6',
            border: '#b76127',
            color: '#ff9e00'
        }
        ,{
            id: 'impressum-btn',
            text: 'Impressum',
            x: 610,
            y: 450,
            width: 120,
            height: 20,
            bg: 'transparent',
            border: 'transparent',
            color: 'black'
        }
        ,{
            id: 'volume-up-btn',
            text: 'Vol +10',
            x: 10,
            y: 175,
            width: 85,
            height: 40,
            bg: '#994509d6',
            border: '#b76127',
            color: '#ff9e00'
        }
        ,{
            id: 'volume-display-btn',
            text: '100',
            x: 10,
            y: 220,
            width: 85,
            height: 40,
            bg: '#994509d6',
            border: '#b76127',
            color: '#ff9e00'
        }
        ,{
            id: 'volume-down-btn',
            text: 'Vol -10',
            x: 10,
            y: 265,
            width: 85,
            height: 40,
            bg: '#994509d6',
            border: '#b76127',
            color: '#ff9e00'
        }
    ];
    canvas = null;
    world = null;
    buttonImageCache = {};

    constructor(){
        super().loadImage('img/9_intro_outro_screens/start/startscreen_1.png');
        this.loadImages(this.winUi);
        this.loadImages(this.loseUi);
        this.loadImages(this.startUi);
        this.posX = 0;
        this.posY = 0;
        this._clickHandler = null;

        // Preload button images
        this.buttonSpecs.forEach(btn => {
            if (btn.img) {
                const img = new Image();
                img.src = btn.img;
                this.buttonImageCache[btn.id] = img;
            }
        });
    }

    setCanvasAndWorld(canvas, world) {
        this.canvas = canvas;
        this.world = world;
        this.setupButtonClicks();
    }

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

    draw(ctx) {
        if (['win', 'lose', 'menu'].includes(this.state)) {
            ctx.drawImage(this.img, this.posX, this.posY, this.width, this.height);
        }
        if (['pause', 'win', 'lose', 'menu'].includes(this.state)) {
            this.drawButtons(ctx);
        }
    }

drawButtons(ctx) {
    const buttonsToDraw = this.getButtonsToDraw();
    this.renderButtons(ctx, buttonsToDraw);
}

getButtonsToDraw() {
    const loadLevelBtn = this.buttonSpecs.find(btn => btn.id === 'load-level-btn');
    let buttonsToDraw;

    switch (this.state) {
        case 'win':
        case 'lose':
            buttonsToDraw = this.buttonSpecs.filter(btn =>
                ['load-level-btn', 'fullscreen-btn', 'to-menu-btn'].includes(btn.id)
            );
            Object.assign(loadLevelBtn, {
                text: 'Try Again',
                y: 420,
                x: 180
            });
            break;

        case 'pause':
        case 'none':
            buttonsToDraw = this.buttonSpecs.filter(btn =>
                ['resume-btn', 'restart-btn', 'fullscreen-btn', 'volume-up-btn', 'volume-display-btn', 'volume-down-btn'].includes(btn.id)
            );
            // Update volume display button with current volume
            const volumeDisplayBtn = buttonsToDraw.find(btn => btn.id === 'volume-display-btn');
            if (volumeDisplayBtn && this.world && this.world.soundManager) {
                volumeDisplayBtn.text = Math.round(this.world.soundManager.volume * 100);
            }
            break;

        case 'menu':
            buttonsToDraw = this.buttonSpecs.filter(btn => ['load-level-btn','impressum-btn'].includes(btn.id));
            Object.assign(loadLevelBtn, {
                text: 'Play Demo',
                y: 420,
                x: 285
            });
            break;
    }

    return buttonsToDraw;
}

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

        ctx.fillStyle = btn.color;
        ctx.font = btn.id === 'impressum-btn' ? 'bold 12px Arial' : 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(btn.text, btn.x + btn.width / 2, btn.y + btn.height / 2);
    });
}


    setupButtonClicks() {
        if (!this.canvas) return;

        // Remove any previously attached handler to avoid duplicate listeners
        if (this._clickHandler) {
            this.canvas.removeEventListener('click', this._clickHandler);
            this._clickHandler = null;
        }

        this._clickHandler = (e) => {
            if (!['pause', 'win', 'lose', 'menu'].includes(this.state)) return;
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            const mouseX = (e.clientX - rect.left) * scaleX;
            const mouseY = (e.clientY - rect.top) * scaleY;

            // Only check visible buttons
            let visibleButtons;
            if (this.state === 'win' || this.state === 'lose') {
                visibleButtons = this.buttonSpecs.filter(btn =>
                    ['load-level-btn', 'to-menu-btn', 'fullscreen-btn'].includes(btn.id)
                );
            } else if (this.state === 'menu') {
                visibleButtons = this.buttonSpecs.filter(btn =>
                    ['load-level-btn', 'impressum-btn'].includes(btn.id) // Play Demo + Impressum clickable
                );
            } else if (this.state === 'pause' || this.state === 'none') {
                visibleButtons = this.buttonSpecs.filter(btn =>
                    ['resume-btn', 'restart-btn', 'fullscreen-btn', 'volume-up-btn', 'volume-display-btn', 'volume-down-btn'].includes(btn.id)
                );
            }

            // Handle only the first button that matches the click (prevents overlapping buttons firing multiple handlers)
            for (const btn of visibleButtons) {
                if (
                    mouseX >= btn.x &&
                    mouseX <= btn.x + btn.width &&
                    mouseY >= btn.y &&
                    mouseY <= btn.y + btn.height
                ) {
                    if (btn.id === 'restart-btn') {
                        this.setState('none');
                        this.world.restartGame();
                        console.log('Restart');
                    }
                    if (btn.id === 'resume-btn') {
                        this.world.togglePause();
                        console.log('Resume');
                    }
                    if (btn.id === 'load-level-btn') {
                        this.world.restartGame();
                        console.log('Tried again');
                    }
                     if (btn.id === 'to-menu-btn') {
                        this.world.level = createLevel1();
                        this.world.clearAllIntervals();
                        this.setState('menu');
                    }
                    if (btn.id === 'fullscreen-btn') {
                        this.world.toggleFullscreen();
                        console.log('Fullscreen Toggle');
                    }
                    if (btn.id === 'impressum-btn') {
                        // Open a placeholder URL in a new tab
                        window.open('https://example.com/impressum', '_blank');
                        console.log('Impressum opened');
                    }
                    if (btn.id === 'volume-up-btn') {
                        if (this.world && this.world.soundManager) {
                            this.world.soundManager.setVolume(Math.min(1, this.world.soundManager.volume + 0.1));
                            console.log('Volume +10');
                        }
                    }
                    if (btn.id === 'volume-down-btn') {
                        if (this.world && this.world.soundManager) {
                            this.world.soundManager.setVolume(Math.max(0, this.world.soundManager.volume - 0.1));
                            console.log('Volume -10');
                        }
                    }

                    break; // stop after first matching button
                }
            }
        };

        this.canvas.addEventListener('click', this._clickHandler);
    }
}