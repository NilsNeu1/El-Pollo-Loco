class SoundManager {

    volume = 0.5;
    lastSoundPlayed = 0;

    constructor() {
        this.mute = false;
        this.initSlider();
        this.initSounds();
    }

    initSounds() {
            this.sounds = {
            collectCoin: new Audio('audio/effects/coin-collect.wav'), // done
            collectBottle: new Audio('audio/effects/bottle-collect.wav'), // done
            brokenBottle: new Audio('audio/effects/bottle-break.mp3'), // done
            throw: new Audio('audio/effects/throw.mp3'), // done
            hit: new Audio('audio/effects/pepe-hit.wav'), // done
            jump: new Audio('audio/effects/jump.mp3'), // done
            chickenDead: new Audio(''),
            chickDead: new Audio('audio/effects/enemies/chicken/chick-sound.mp3'),
            bossAgro: new Audio('audio/effects/enemies/boss/boss-entry.mp3'), 
            bossChickenDead: new Audio(''),
            backgroundMusic: new Audio(''),
            gameOver: new Audio('audio/win&lose/level-lose.wav'), // done
            gameWon: new Audio('audio/win&lose/level-win.wav'), // done
        };
        this.sounds.backgroundMusic.loop = true;
    }

    playSound(soundName){
        const now = Date.now();
        let sound = this.sounds[soundName];
        if (!this.mute && sound) {
            if (now - this.lastSoundPlayed < 500) {
                console.log(soundName,'played')
                this.setVolume(this.volume);
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

    setVolume(volume) {
        this.volume = volume;
        Object.values(this.sounds).forEach(audio => {
            if (audio.src) { // Nur wenn Datei existiert
                audio.volume = volume;
            }
        });
    }

    initSlider(){
        const volumeSlider = document.getElementById('volume');
        if (!volumeSlider) return;
        volumeSlider.addEventListener('input', ({target}) => {
            const value = Number(target.value) / 100; // Wert als Zahl
            this.setVolume(value);
            console.log('Volume set to', this.volume);
        });
    }

}