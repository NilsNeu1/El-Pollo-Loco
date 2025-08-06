class GameStateUI extends MovableObject {

    width = 720;
    height = 480;
    winUi = ['img/9_intro_outro_screens/game-won/You Win A.png'];
    loseUi = ['img/9_intro_outro_screens/game_over/game over.png'];
    state = ['none']; // 'none', 'win', 'lose', 'pause'
    imageCache = [];

    constructor(){
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        this.loadImages(this.winUi);
        this.loadImages(this.loseUi);
        this.posX = 0;
        this.posY = 0;
    }

    setState(state) {
        this.state = state;
        if (state === 'win') {
            this.img = this.imageCache[this.winUi];
        } else if (state === 'lose') {
            this.img = this.imageCache[this.loseUi];
        } else {
            this.img = null; // Hide image for 'none' or 'pause'
        }
    }

    draw(ctx) {
        if (this.state === 'win' || this.state === 'lose') {
            ctx.drawImage(this.img, this.posX, this.posY, this.width, this.height);
        }
        // No image for 'none' or 'pause'
    }
}