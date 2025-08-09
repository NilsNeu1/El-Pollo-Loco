class GameStateUI extends DrawableObject {

    width = 720;
    height = 480;
    winUi = ['img/9_intro_outro_screens/game-won/You Win A.png'];
    loseUi = ['img/9_intro_outro_screens/game_over/game over.png'];
    state = 'none'; // 'none', 'win', 'lose', 'pause'
    imageCache = [];
    buttonSpecs = [
        {
            text: 'Restart',
            x: 180,
            y: 400,
            width: 150,
            height: 40,
            bg: '#994509d6',
            border: '#b76127',
            color: '#ff9e00'
        },
         {
            text: 'Try Again',
            x: 285,
            y: 400,
            width: 150,
            height: 40,
            bg: '#994509d6',
            border: '#b76127',
            color: '#ff9e00'
        },
        {
            text: 'Resume',
            x: 390,
            y: 400,
            width: 150,
            height: 40,
            bg: '#994509d6',
            border: '#b76127',
            color: '#ff9e00'
        }
    ];
    canvas = null;
    world = null;

    constructor(){
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        this.loadImages(this.winUi);
        this.loadImages(this.loseUi);
        this.posX = 0;
        this.posY = 0;
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
        } else {
            this.img = null;
        }
    }

    draw(ctx) {
        if (this.state === 'win' || this.state === 'lose') {
            ctx.drawImage(this.img, this.posX, this.posY, this.width, this.height);
        }
        if (['pause', 'win', 'lose'].includes(this.state)) {
            this.drawButtons(ctx);
        }
    }

    drawButtons(ctx) {
        let buttonsToDraw;
        if (this.state === 'win' || this.state === 'lose') {
            buttonsToDraw = this.buttonSpecs.filter(btn => btn.text === 'Try Again');
        } else if (this.state === 'pause' || this.state === 'none') {
            buttonsToDraw = this.buttonSpecs.filter(btn => btn.text === 'Resume' || btn.text === 'Restart');
        } else {
            buttonsToDraw = [];
        }

        buttonsToDraw.forEach(btn => {
            ctx.fillStyle = btn.bg;
            ctx.fillRect(btn.x, btn.y, btn.width, btn.height);

            ctx.strokeStyle = btn.border;
            ctx.lineWidth = 3;
            ctx.strokeRect(btn.x, btn.y, btn.width, btn.height);

            ctx.fillStyle = btn.color;
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(btn.text, btn.x + btn.width / 2, btn.y + btn.height / 2);
        });
    }

    setupButtonClicks() {
        if (!this.canvas) return;
        this.canvas.addEventListener('click', (e) => { // fügt ein Eventlistener für jeden cklick hinzu
            if (!['pause', 'win', 'lose'].includes(this.state)) return; // clicks werden nur bei win, lose oder pause erkannt
            const rect = this.canvas.getBoundingClientRect(); // get BoundingClientRect gibt die position des canvas im viewport an 
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            const mouseX = (e.clientX - rect.left) * scaleX;
            const mouseY = (e.clientY - rect.top) * scaleY;
            
            this.buttonSpecs.forEach((btn, idx) => {
                if (
                    mouseX >= btn.x &&
                    mouseX <= btn.x + btn.width &&
                    mouseY >= btn.y &&
                    mouseY <= btn.y + btn.height
                ) {
                    if (btn.text === 'Restart') {
                        this.setState('none');
                        this.world.restartGame();
                        console.log('Restart');
                    }
                    if (btn.text === 'Resume') {
                        this.world.togglePause();
                        console.log('Resume');
                    }
                    if (btn.text === 'Try Again') {
                        this.world.restartGame();
                        console.log('Tried again');
                    }
                }
            });
        });
    }
}