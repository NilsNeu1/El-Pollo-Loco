class SoundManager {
    constructor() {
        this.mute = false;
        this.volume = 0.5;
        this.sounds = {
            collectCoin: new Audio('audio/effects/coin-collect.wav'),
            collectBottle: new Audio('audio/effects/bottle-collect.wav'),
            brokenBottle: new Audio('audio/effects/bottle-break.mp3'),
            hit: new Audio('audio/effects/pepe-hit.wav'),
            jump: new Audio(''),
            chickenDead: new Audio('audio/effects/chicken-dead.wav'),
            bossChickenDead: new Audio(''),
            backgroundMusic: new Audio(''),
            gameOver: new Audio('audio/win&lose/level-lose.wav')
        };
        this.sounds.backgroundMusic.loop = true;
    }

    playSound(SoundName){
        let sound = this.sounds[SoundName];
        if (!this.mute && sound) {
            sound.currentTime = 0;
            sound.play();
        }

    }

    setVolume(volume){
        this.volume = volume;
        for (let sound in this.sounds) {
            this.sounds[sound].volume = volume;
        }
    }

}