/**
 * Manages all sound effects and background music for the game.
 * Provides functionality for playing, stopping, muting, and adjusting volume.
 * Persists volume settings using localStorage and synchronizes with an HTML slider.
 */
class SoundManager {

    /** @type {number} Current volume level (0.0 - 1.0) */
    volume = 0.5;

    /** @type {number} Timestamp of the last sound played (used for cooldown) */
    lastSoundPlayed = 0;

    /**
     * Creates a new SoundManager instance.
     * Initializes mute state, loads saved volume, sets up slider, and prepares sounds.
     */
    constructor() {
        /** @type {boolean} Whether sounds are muted */
        this.mute = false;
        this.loadSavedVolume();
        this.initSlider();
        this.initSounds();
        this.setVolume(this.volume);
    }

    /**
     * Initializes all game sounds and background music.
     * Stores them in the `sounds` object for easy access.
     */
    initSounds() {
        this.sounds = {
            collectCoin: new Audio('audio/effects/coin-collect.wav'),
            collectBottle: new Audio('audio/effects/bottle-collect.wav'),
            brokenBottle: new Audio('audio/effects/bottle-break.mp3'),
            throw: new Audio('audio/effects/throw.mp3'),
            hit: new Audio('audio/effects/pepe-hit.wav'),
            jump: new Audio('audio/effects/jump.mp3'),
            pepeIdle: new Audio('audio/effects/idle.mp3'),
            chickenDead: new Audio(''),
            chickDead: new Audio('audio/effects/enemies/chicken/chick-sound.mp3'),
            bossAgro: new Audio('audio/effects/enemies/boss/boss-entry.mp3'),
            bossChickenDead: new Audio(''),
            backgroundMusic: new Audio('audio/songs/game-theme.mp3'),
            menuMusic: new Audio('audio/songs/menu-theme.mp3'),
            gameOver: new Audio('audio/win&lose/level-lose.wav'),
            gameWon: new Audio('audio/win&lose/level-win.wav'),
        };
        this.sounds.backgroundMusic.loop = true;
    }

    /**
     * Plays a sound by name if not muted.
     * Prevents overlapping sounds by enforcing a short cooldown.
     * @param {string} soundName - Key of the sound in `this.sounds`.
     */
    playSound(soundName) {
        const now = Date.now();
        let sound = this.sounds[soundName];
        if (!this.mute && sound && world.enableSounds == true) {
            if (now - this.lastSoundPlayed < 500) {
                this.setVolume(this.volume);
                sound.play();
                return;
            }
            sound.currentTime = 0;
            sound.play();
            this.lastSoundPlayed = now;
        }
    }

    /**
     * Stops a sound by name and resets its playback position.
     * @param {string} soundName - Key of the sound in `this.sounds`.
     */
    stopSound(soundName) {
        let sound = this.sounds[soundName];
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
        }
    }

    /**
     * Sets the global volume for all sounds.
     * Persists the value to localStorage and updates the HTML slider if present.
     * @param {number} volume - Volume level (0.0 - 1.0).
     */
    setVolume(volume) {
        this.volume = volume;
        Object.values(this.sounds).forEach(audio => {
            if (audio.src) {
                audio.volume = volume;
            }
        });
        this.saveVolume();
        try {
            const volumeSlider = document.getElementById('volume');
            if (volumeSlider) volumeSlider.value = Math.round(this.volume * 100);
        } catch (e) { }
    }

    /**
     * Initializes the HTML volume slider and syncs it with the SoundManager.
     * Updates volume in real-time when the slider is moved.
     */
    initSlider() {
        const volumeSlider = document.getElementById('volume');
        if (!volumeSlider) return;
        try { volumeSlider.value = Math.round(this.volume * 100); } catch (e) { }
        volumeSlider.addEventListener('input', ({ target }) => {
            const value = Number(target.value) / 100;
            this.setVolume(value);
        });
    }

    /**
     * Loads saved volume from localStorage if available.
     */
    loadSavedVolume() {
        try {
            const stored = localStorage.getItem('gameVolume');
            if (stored !== null) {
                const v = Number(stored);
                if (!isNaN(v)) this.volume = v;
            }
        } catch (e) {
            console.error('LoadSavedVolume error:', e);
        }
    }

    /**
     * Saves the current volume to localStorage.
     */
    saveVolume() {
        try {
            localStorage.setItem('gameVolume', String(this.volume));
        } catch (e) {
            console.error('SaveVolume error:', e);
        }
    }
}
