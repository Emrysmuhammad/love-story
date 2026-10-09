(function (root) {
  'use strict';

  const rand = (min, max) => Math.random() * (max - min) + min;
  const pick = (list) => list[Math.floor(Math.random() * list.length)];

  // Red dominates (8 of 14 entries), supported by pink, purple and gold
  const HEART_COLORS = [
    '#e11d48', '#dc2626', '#ef4444', '#be123c', '#e11d48', '#ef4444', '#dc2626', '#f43f5e',
    '#fb7185', '#f472b6', '#f9a8d4', '#c084fc', '#a855f7', '#fbbf24'
  ];

  // Mostly hearts, with some pearls and sparkles
  const KINDS = ['heart', 'heart', 'heart', 'heart', 'heart', 'pearl', 'sparkle', 'sparkle'];

  // Directions a particle can travel. x is in vw, y is in vh.
  const ROUTES = [
    // rise from the bottom
    () => { const x = rand(0, 100); return { x0: x, y0: 108, x1: x + rand(-18, 18), y1: -12 }; },
    // fall from the top
    () => { const x = rand(0, 100); return { x0: x, y0: -12, x1: x + rand(-18, 18), y1: 108 }; },
    // drift left to right
    () => ({ x0: -8, y0: rand(10, 95), x1: 108, y1: rand(5, 95) }),
    // drift right to left
    () => ({ x0: 108, y0: rand(10, 95), x1: -8, y1: rand(5, 95) }),
    // diagonal up and to the right
    () => ({ x0: rand(-5, 40), y0: 108, x1: rand(60, 108), y1: -12 }),
    // diagonal down and to the left
    () => ({ x0: rand(60, 105), y0: -12, x1: rand(-8, 40), y1: 108 })
  ];

  const SIZES = {
    heart: [12, 38],
    pearl: [8, 18],
    sparkle: [10, 22]
  };

  const Particles = {
    container: null,
    timer: null,
    rateMs: 520,
    max: 30,
    baseMax: 30,

    /** Begin the endless stream of floating hearts, pearls and sparkles. */
    start(container) {
      // Respect people who asked their device for less motion
      if (root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      this.container = container;
      const small = root.matchMedia && root.matchMedia('(max-width: 600px)').matches;
      this.baseMax = small ? 18 : 30;
      this.setMode('calm');

      // Pre-fill so the screen is not empty at the start
      for (let i = 0; i < Math.round(this.baseMax / 3); i++) this.spawn(true);
      this.schedule();
    },

    /** 'calm' for normal play, 'celebrate' for the finale. */
    setMode(mode) {
      if (mode === 'celebrate') {
        this.rateMs = 240;
        this.max = Math.round(this.baseMax * 1.6);
      } else {
        this.rateMs = 520;
        this.max = this.baseMax;
      }
    },

    schedule() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        if (!document.hidden) this.spawn(false);
        this.schedule();
      }, this.rateMs * rand(0.7, 1.3));
    },

    /** Create one particle. When `seed` is true it starts part-way through its journey. */
    spawn(seed) {
      const container = this.container;
      if (!container || container.childElementCount >= this.max) return;

      const kind = pick(KINDS);
      const route = pick(ROUTES)();
      const duration = rand(10, 20);
      const [minSize, maxSize] = SIZES[kind];

      const el = document.createElement('span');
      el.className = 'particle particle--' + kind;
      el.style.setProperty('--x0', route.x0.toFixed(1) + 'vw');
      el.style.setProperty('--y0', route.y0.toFixed(1) + 'vh');
      el.style.setProperty('--x1', route.x1.toFixed(1) + 'vw');
      el.style.setProperty('--y1', route.y1.toFixed(1) + 'vh');
      el.style.setProperty('--dur', duration.toFixed(1) + 's');
      el.style.setProperty('--delay', seed ? '-' + rand(0, duration * 0.8).toFixed(1) + 's' : '0s');
      el.style.setProperty('--rot', rand(-70, 70).toFixed(0) + 'deg');
      el.style.setProperty('--o', rand(0.45, 0.9).toFixed(2));

      const inner = document.createElement('span');
      inner.className = 'particle__inner';
      inner.style.setProperty('--size', rand(minSize, maxSize).toFixed(0) + 'px');
      inner.style.setProperty('--sway', rand(8, 30).toFixed(0) + 'px');
      inner.style.setProperty('--sway-dur', rand(2.5, 5).toFixed(1) + 's');

      if (kind === 'heart') {
        inner.textContent = '\u2665';
        inner.style.color = pick(HEART_COLORS);
      } else if (kind === 'sparkle') {
        inner.textContent = '\u2726';
      }

      el.appendChild(inner);
      // Clean up when the journey ends (ignore the inner element's endless sway)
      el.addEventListener('animationend', (event) => {
        if (event.target === el) el.remove();
      });
      container.appendChild(el);
    }
  };

  root.Love = root.Love || {};
  root.Love.Particles = Particles;
})(typeof window !== 'undefined' ? window : globalThis);