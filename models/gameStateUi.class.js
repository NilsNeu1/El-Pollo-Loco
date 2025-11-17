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

    setCanvasAndWorld(canvas, world) {
        this.canvas = canvas;
        this.world = world;
        if (this.loadButtonSpecsPromise) {
            this.loadButtonSpecsPromise.then(() => this.setupButtonClicks());
        } else {
            this.setupButtonClicks();
        }
    }

    preloadButtonImages() {
        this.buttonSpecs.forEach(btn => {
            if (btn.img) {
                const img = new Image();
                img.src = btn.img;
                this.buttonImageCache[btn.id] = img;
            }
        });
    }

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
            if (loadLevelBtn) {
                Object.assign(loadLevelBtn, {
                    text: 'Try Again',
                    y: 420,
                    x: 180
                });
            }
            break;

        case 'pause':
        case 'none':
            buttonsToDraw = this.buttonSpecs.filter(btn =>
                ['resume-btn', 'restart-btn', 'fullscreen-btn', 'volume-up-btn', 'volume-display-btn', 'volume-down-btn'].includes(btn.id)
            );
            const volumeDisplayBtn = buttonsToDraw.find(btn => btn.id === 'volume-display-btn');
            if (volumeDisplayBtn && this.world && this.world.soundManager) {
                volumeDisplayBtn.text = Math.round(this.world.soundManager.volume * 100);
            }
            break;

        case 'menu':
            buttonsToDraw = this.buttonSpecs.filter(btn => ['load-level-btn','impressum-btn'].includes(btn.id));
            if (loadLevelBtn) {
                Object.assign(loadLevelBtn, {
                    text: 'Play Demo',
                    y: 420,
                    x: 285
                });
            }
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
    this.removeClickHandler();

    this.clickHandler = (e) => {
        if (!['pause', 'win', 'lose', 'menu'].includes(this.state)) return;

        const { mouseX, mouseY } = this.getMousePosition(e);
        const visibleButtons = this.getVisibleButtons();

        this.handleButtonClick(mouseX, mouseY, visibleButtons);
    };

    this.canvas.addEventListener('click', this.clickHandler);
}

removeClickHandler() {
    if (this.clickHandler) {
        this.canvas.removeEventListener('click', this.clickHandler);
        this.clickHandler = null;
    }
}

getMousePosition(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    return {
        mouseX: (e.clientX - rect.left) * scaleX,
        mouseY: (e.clientY - rect.top) * scaleY
    };
}

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

executeButtonAction(id) {
    switch (id) {
        case 'restart-btn':
            this.setState('none');
            this.world.restartGame();
            break;
        case 'resume-btn':
            this.world.togglePause();
            break;
        case 'load-level-btn':
            this.world.restartGame();
            break;
        case 'to-menu-btn':
            this.world.level = createLevel1();
            this.world.clearAllIntervals();
            this.setState('menu');
            break;
        case 'fullscreen-btn':
            this.world.toggleFullscreen();
            break;
        case 'impressum-btn':
            window.open('https://example.com/impressum', '_blank');
            break;
        case 'volume-up-btn':
            if (this.world?.soundManager) {
                this.world.soundManager.setVolume(
                    Math.min(1, this.world.soundManager.volume + 0.1)
                );
            }
            break;
        case 'volume-down-btn':
            if (this.world?.soundManager) {
                this.world.soundManager.setVolume(
                    Math.max(0, this.world.soundManager.volume - 0.1)
                );
            }
            break;
    }
}

}