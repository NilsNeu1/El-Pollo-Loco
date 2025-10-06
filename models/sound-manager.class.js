class SoundManager {
    constructor() {
        this.mute = false;
        this.volume = 0.5;
        this.sounds = {
            collectCoin: new Audio('audio/effects/coin-collect.wav'),
            collectBottle: new Audio('audio/effects/bottle-collect.wav'),
            brokenBottle: new Audio('audio/effects/bottle-break.mp3'),
            throw: new Audio(''),
            hit: new Audio('audio/effects/pepe-hit.wav'),
            jump: new Audio(''),
            chickenDead: new Audio('audio/effects/chicken-dead.wav'),
            bossChickenDead: new Audio(''),
            backgroundMusic: new Audio(''),
            gameOver: new Audio('audio/win&lose/level-lose.wav'),
            gameWon: new Audio('audio/win&lose/level-win.wav')
        };
        this.sounds.backgroundMusic.loop = true;
    }

    playSound(soundName){
        const now = Date.now();
        let sound = this.sounds[soundName];
        if (!this.mute && sound) {
            if (now - this.lastSoundPlayed < 500) {
                console.log(soundName,'played')
                sound.play();
                return;
            }
            sound.currentTime = 0;
            sound.play();
            this.lastSoundPlayed = now;
        }

    }

    stopSound(soundName){
        let sound = this.sounds[soundName];
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
        }
    }

    setVolume(volume){
        this.volume = volume;
        for (let sound in this.sounds) {
            this.sounds[sound].volume = volume;
        }
    }

}