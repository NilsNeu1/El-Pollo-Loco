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
            text: 'f',
            img: 'img/Assets/expand.png',
            x: 685,
            y: 10,
            width: 20,
            height: 20,
            bg: 'none',
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
                ['resume-btn', 'restart-btn', 'fullscreen-btn'].includes(btn.id)
            );
            break;

        case 'menu':
            buttonsToDraw = this.buttonSpecs.filter(btn => btn.id === 'load-level-btn');
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
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(btn.text, btn.x + btn.width / 2, btn.y + btn.height / 2);
    });
}


    setupButtonClicks() {
        if (!this.canvas) return;
        this.canvas.addEventListener('click', (e) => {
            if (!['pause', 'win', 'lose', 'menu'].includes(this.state)) return;
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            const mouseX = (e.clientX - rect.left) * scaleX;
            const mouseY = (e.clientY - rect.top) * scaleY;

            // Only check visible buttons
            let visibleButtons;
            if (this.state === 'win' || this.state === 'lose' || this.state === 'menu') {
                visibleButtons = this.buttonSpecs.filter(btn => btn.id === 'load-level-btn' || btn.id === 'to-menu-btn');
            } else if (this.state === 'pause' || this.state === 'none') {
                visibleButtons = this.buttonSpecs.filter(btn => btn.id === 'resume-btn' || btn.id === 'restart-btn');
            } else {
                visibleButtons = [];
            }

            visibleButtons.forEach((btn) => {
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
                }
            });
        });
    }
}