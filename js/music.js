(function (root) {
  'use strict';

  /**
   * Looping background music with a play/pause button and volume slider.
   *
   * - Tries each source in order until one loads.
   * - Browsers block sound until the visitor interacts with the page, so if
   *   autoplay is refused the music starts on the very first tap or key press.
   * - If the internet comes back ('online' event), it tries again.
   *
   * States: idle | playing | paused | blocked | unavailable
   */
  const Music = {
    audio: null,
    cfg: null,
    btn: null,
    slider: null,
    sourceIndex: 0,
    state: 'idle',
    userPaused: false,
    switching: false,
    targetVolume: 0.35,
    fadeTimer: null,
    gestureHandler: null,

    init(cfg, btn, slider) {
      this.cfg = cfg;
      this.btn = btn;
      this.slider = slider;
      this.targetVolume = cfg.VOLUME;

      const audio = new Audio();
      audio.loop = true;            // play continuously
      audio.preload = 'auto';
      audio.volume = 0;             // faded in once playback starts
      this.audio = audio;

      audio.addEventListener('error', () => this.nextSource());
      audio.addEventListener('playing', () => this.setState('playing'));
      audio.addEventListener('pause', () => {
        if (!this.switching && this.state === 'playing') this.setState('paused');
      });

      slider.value = String(cfg.VOLUME);
      slider.addEventListener('input', () => {
        this.targetVolume = Number(slider.value);
        if (!this.fadeTimer) audio.volume = this.targetVolume;
      });

      btn.addEventListener('click', () => this.toggle());
      root.addEventListener('online', () => this.onOnline());

      this.setState('idle');
      this.loadSource(0);
      this.requestPlay();
    },

    loadSource(index) {
      this.sourceIndex = index;
      this.switching = true;
      this.audio.src = this.cfg.SOURCES[index];
      this.audio.load();
      this.switching = false;
    },

    /** The current source failed: try the next one, or give up gracefully. */
    nextSource() {
      const next = this.sourceIndex + 1;
      if (next >= this.cfg.SOURCES.length) {
        this.setState('unavailable');
        return;
      }
      this.loadSource(next);
      if (!this.userPaused) this.requestPlay();
    },

    requestPlay() {
      if (this.state === 'unavailable') return;
      const attempt = this.audio.play();
      if (attempt && typeof attempt.then === 'function') {
        attempt
          .then(() => this.fadeIn())
          .catch((error) => {
            if (error && error.name === 'NotAllowedError') {
              // Autoplay blocked: wait for the first tap, click or key press
              this.setState('blocked');
              this.waitForGesture();
            }
            // Other errors (a source that cannot load) are handled by the 'error' event
          });
      }
    },

    waitForGesture() {
      if (this.gestureHandler) return;
      this.gestureHandler = (event) => {
        this.stopWaiting();
        // If they pressed the music button itself, its own click handler takes over
        if (this.btn.contains(event.target)) return;
        if (!this.userPaused && this.state !== 'playing') this.requestPlay();
      };
      ['pointerdown', 'keydown', 'touchstart'].forEach((type) => {
        document.addEventListener(type, this.gestureHandler, true);
      });
    },

    stopWaiting() {
      if (!this.gestureHandler) return;
      ['pointerdown', 'keydown', 'touchstart'].forEach((type) => {
        document.removeEventListener(type, this.gestureHandler, true);
      });
      this.gestureHandler = null;
    },

    fadeIn() {
      clearInterval(this.fadeTimer);
      const steps = Math.max(1, Math.round(this.cfg.FADE_MS / 100));
      let step = 0;
      this.fadeTimer = setInterval(() => {
        step++;
        this.audio.volume = Math.min(1, this.targetVolume * (step / steps));
        if (step >= steps) {
          clearInterval(this.fadeTimer);
          this.fadeTimer = null;
          this.audio.volume = this.targetVolume;
        }
      }, 100);
    },

    toggle() {
      if (this.state === 'unavailable') {
        this.retry();
      } else if (this.state === 'playing') {
        this.userPaused = true;
        this.audio.pause();
        this.setState('paused');
      } else {
        this.userPaused = false;
        this.requestPlay();
      }
    },

    retry() {
      this.userPaused = false;
      this.setState('idle');
      this.loadSource(0);
      this.requestPlay();
    },

    onOnline() {
      if (this.state === 'unavailable') this.retry();
      else if (!this.userPaused && this.state !== 'playing') this.requestPlay();
    },

    setState(state) {
      this.state = state;
      const labels = {
        idle: ['\u266A', 'Play music'],
        blocked: ['\u266A', 'Play music'],
        paused: ['\u25B6', 'Play music'],
        playing: ['\u275A\u275A', 'Pause music'],
        unavailable: ['\u2715', 'Music unavailable. Click to try again']
      };
      const [icon, label] = labels[state];
      this.btn.textContent = icon;
      this.btn.setAttribute('aria-label', label);
      this.btn.setAttribute('aria-pressed', String(state === 'playing'));
      this.btn.title = label;
      this.btn.dataset.state = state;
      this.btn.classList.toggle('is-unavailable', state === 'unavailable');
    }
  };

  root.Love = root.Love || {};
  root.Love.Music = Music;
})(typeof window !== 'undefined' ? window : globalThis);