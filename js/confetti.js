(function (root) {
  'use strict';

  const rand = (min, max) => Math.random() * (max - min) + min;
  const pick = (list) => list[Math.floor(Math.random() * list.length)];

  const HEART_COLORS = ['#e11d48', '#ef4444', '#dc2626', '#f43f5e', '#fb7185', '#f472b6', '#c084fc'];
  const SPARKLE_COLORS = ['#fbbf24', '#fde68a', '#ffffff'];
  const PETAL_COLORS = ['#f9a8d4', '#fbcfe8', '#ffffff'];

  const GLYPHS = [
    { char: '\u2665', colors: HEART_COLORS },
    { char: '\u2665', colors: HEART_COLORS },
    { char: '\u2665', colors: HEART_COLORS },
    { char: '\u2665', colors: HEART_COLORS },
    { char: '\u2726', colors: SPARKLE_COLORS },
    { char: '\u2740', colors: PETAL_COLORS }
  ];

  const Confetti = {
    layer: null,

    getLayer() {
      if (!this.layer) {
        this.layer = document.createElement('div');
        this.layer.className = 'confetti-layer';
        this.layer.setAttribute('aria-hidden', 'true');
        document.body.appendChild(this.layer);
      }
      return this.layer;
    },

    /**
     * Shoot a burst of confetti hearts.
     * x and y are pixel coordinates of the origin (default: upper middle of the screen).
     */
    burst(options) {
      const opts = options || {};
      if (root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const layer = this.getLayer();
      const count = opts.count || 80;
      const ox = opts.x === undefined ? '50%' : opts.x + 'px';
      const oy = opts.y === undefined ? '38%' : opts.y + 'px';

      for (let i = 0; i < count; i++) {
        if (layer.childElementCount > 320) break; // safety cap

        const glyph = pick(GLYPHS);
        const duration = rand(2.6, 4.4);
        const el = document.createElement('span');

        el.className = 'confetti';
        el.textContent = glyph.char;
        el.style.color = pick(glyph.colors);
        el.style.setProperty('--ox', ox);
        el.style.setProperty('--oy', oy);
        el.style.setProperty('--size', rand(12, 30).toFixed(0) + 'px');
        el.style.setProperty('--dx', rand(-48, 48).toFixed(0) + 'vw');
        el.style.setProperty('--peak', '-' + rand(10, 38).toFixed(0) + 'vh');
        el.style.setProperty('--fall', rand(55, 105).toFixed(0) + 'vh');
        el.style.setProperty('--rot', rand(-540, 540).toFixed(0) + 'deg');
        el.style.setProperty('--dur', duration.toFixed(1) + 's');

        el.addEventListener('animationend', () => el.remove());
        layer.appendChild(el);
      }
    }
  };

  root.Love = root.Love || {};
  root.Love.Confetti = Confetti;
})(typeof window !== 'undefined' ? window : globalThis);