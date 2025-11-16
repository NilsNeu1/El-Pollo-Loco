class SoundManager {

    volume = 0.5;
    lastSoundPlayed = 0;

    constructor() {
        this.mute = false;
        // load saved volume from localStorage (if present)
        this.loadSavedVolume();
        this.initSlider();
        this.initSounds();
        // apply volume to any sounds that will be initialized
        this.setVolume(this.volume);
    }

    initSounds() {
            this.sounds = {
            collectCoin: new Audio('audio/effects/coin-collect.wav'), // done
            collectBottle: new Audio('audio/effects/bottle-collect.wav'), // done
            brokenBottle: new Audio('audio/effects/bottle-break.mp3'), // done
            throw: new Audio('audio/effects/throw.mp3'), // done
            hit: new Audio('audio/effects/pepe-hit.wav'), // done
            jump: new Audio('audio/effects/jump.mp3'), // done
            pepeIdle: new Audio('audio/effects/idle.mp3'),
            chickenDead: new Audio(''),
            chickDead: new Audio('audio/effects/enemies/chicken/chick-sound.mp3'),
            bossAgro: new Audio('audio/effects/enemies/boss/boss-entry.mp3'), // done
            bossChickenDead: new Audio(''),
            backgroundMusic: new Audio('audio/songs/game-theme.mp3'), // done
            menuMusic: new Audio('audio/songs/menu-theme.mp3'),
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
        // persist to localStorage so value survives page refresh
        this.saveVolume();
        // keep HTML volume slider in sync (if present)
        try {
            const volumeSlider = document.getElementById('volume');
            if (volumeSlider) volumeSlider.value = Math.round(this.volume * 100);
        } catch (e) {}
    }

    initSlider(){
        const volumeSlider = document.getElementById('volume');
        if (!volumeSlider) return;
        // initialize slider position
        try { volumeSlider.value = Math.round(this.volume * 100); } catch (e) {}
        volumeSlider.addEventListener('input', ({target}) => {
            const value = Number(target.value) / 100; // Wert als Zahl
            this.setVolume(value);
            console.log('Volume set to', this.volume);
        });
    }

    loadSavedVolume() {
        try {
            const stored = localStorage.getItem('gameVolume');
            if (stored !== null) {
                const v = Number(stored);
                if (!isNaN(v)) this.volume = v;
            }
        } catch (e) {
            // ignore if localStorage unavailable
        }
    }

    saveVolume() {
        try {
            localStorage.setItem('gameVolume', String(this.volume));
        } catch (e) {
            // ignore
        }
    }

}