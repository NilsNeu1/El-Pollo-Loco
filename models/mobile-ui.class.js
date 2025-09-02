class MobileButtons extends DrawableObject {
    buttonSpecs = [
        {
            id: 'left-btn',
            img: 'img/placeholder_left.png',
            x: 200,
            y: 440,
            action: 'moveLeft'
        },
        {
            id: 'right-btn',
            img: 'img/placeholder_right.png',
            x: 240,
            y: 440,
            action: 'moveRight'
        },
        {
            id: 'jump-btn',
            img: 'img/placeholder_jump.png',
            x: 280,
            y: 440,
            action: 'jump'
        },
        {
            id: 'attack-btn',
            img: 'img/placeholder_attack.png',
            x: 320,
            y: 440,
            action: 'attack'
        },
        {
            id: 'pause-btn',
            img: 'img/placeholder_pause.png',
            x: 360,
            y: 440,
            action: 'pause'
        }
    ];
    width = 20;
    height = 20;
    canvas = null;
    world = null;
    imageCache = {};

    constructor() {
        super();
        this.buttonSpecs.forEach(btn => this.loadImage(btn.img));
        this.posX = 0;
        this.posY = 0;
    }

    setCanvasAndWorld(canvas, world) {
        this.canvas = canvas;
        this.world = world;
        this.setupButtonClicks();
    }

    loadImage(src) {
        const img = new Image();
        img.src = src;
        this.imageCache[src] = img;
    }

    draw(ctx) {
        this.buttonSpecs.forEach(btn => {
            ctx.save();
            ctx.beginPath();
            ctx.arc(btn.x + this.width / 2, btn.y + this.height / 2, this.width / 2, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fillStyle = '#fff';
            ctx.globalAlpha = 0.7;
            ctx.fill();
            ctx.strokeStyle = '#b76127';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.globalAlpha = 1.0;
            // zeichnet die bilder erst wenn sie fertig geladen sind (complete)
            const img = this.imageCache[btn.img];
            if (img && img.complete) {
                ctx.drawImage(img, btn.x, btn.y, this.width, this.height);
            }
            ctx.restore();
        });
    }

setupButtonTouches() {
    let activeButton = null;

    this.canvas.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const touchX = (touch.clientX - rect.left) * scaleX;
        const touchY = (touch.clientY - rect.top) * scaleY;

        this.buttonSpecs.forEach(btn => {
            const centerX = btn.x + this.width / 2;
            const centerY = btn.y + this.height / 2;
            const dist = Math.sqrt((touchX - centerX) ** 2 + (touchY - centerY) ** 2);
            if (dist <= this.width / 2) {
                this.handleButtonAction(btn.action);
            }
        });
    });

    this.canvas.addEventListener('touchend', () => {
        // 
    });
}


    handleButtonAction(action) {
        if (!this.world) return;
        switch (action) {
            case 'moveLeft':
                this.world.character.moveLeft();
                break;
            case 'moveRight':
                this.world.character.moveRight();
                break;
            case 'jump':
                this.world.character.jump();
                break;
            case 'attack':
                this.world.character.attack();
                break;
            case 'pause':
                this.world.togglePause();
                break;
        }
    }
}