class MobileButtons extends DrawableObject {
    buttonSpecs = [
        {
            id: 'left-btn',
            img: '',
            x: 40,
            y: 400,
            action: 'moveLeft'
        },
        {
            id: 'right-btn',
            img: '',
            x: 110,
            y: 400,
            action: 'moveRight'
        },
        {
            id: 'jump-btn',
            img: '',
            x: 580,
            y: 400,
            action: 'jump'
        },
        {
            id: 'attack-btn',
            img: '',
            x: 650,
            y: 400,
            action: 'attack'
        },
        {
            id: 'pause-btn',
            img: '',
            x: 650,
            y: 30,
            action: 'pause'
        }
    ];
    width = 40;
    height = 40;
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
        this.setupButtonTouches();
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
                activeButton = btn.action;
                this.handleButtonAction(activeButton, true); // Taste aktivieren
                console.log('mobile ' + activeButton);
            }
        });
    });

    this.canvas.addEventListener('touchend', () => {
        if (activeButton && activeButton !== 'pause') {
            this.handleButtonAction(activeButton, false); // Taste deaktivieren
            activeButton = null;
        }
    });
}



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
            if (isPressed) this.world.character.jump();
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