(function (root) {
  'use strict';

  const MARGIN = 12;        // keep the button this far from the screen edges
  const YES_PADDING = 28;   // keep the button this far from the Yes button

  const rand = (min, max) => Math.random() * (max - min) + min;

  function makeRect(x, y, w, h) {
    return { left: x, top: y, right: x + w, bottom: y + h };
  }

  /** Distance from a point to the nearest edge of a rectangle (0 when inside). */
  function distanceToRect(px, py, rect) {
    const dx = Math.max(rect.left - px, 0, px - rect.right);
    const dy = Math.max(rect.top - py, 0, py - rect.bottom);
    return Math.hypot(dx, dy);
  }

  function overlaps(a, b, pad) {
    return a.left < b.right + pad && a.right > b.left - pad &&
           a.top < b.bottom + pad && a.bottom > b.top - pad;
  }

  /**
   * Makes a button impossible to click.
   *
   * - When the pointer gets close, the button instantly jumps to a random
   *   spot that is far from the pointer and not on top of the Yes button.
   * - A tap or press that lands on it also makes it jump, and a click or
   *   keyboard focus is cancelled, so it can never actually be activated.
   * - On the first escape the button moves to <body> and becomes position:
   *   fixed, so it can run anywhere on the screen (a placeholder keeps the
   *   layout steady so the Yes button does not shift).
   *
   * options: { distance, onDodge(count) }
   */
  class EscapeButton {
    constructor(button, yesButton, options) {
      this.btn = button;
      this.yes = yesButton;
      this.opts = options || {};
      this.distance = this.opts.distance || 110;

      this.escaping = false;
      this.count = 0;
      this.pos = { x: 0, y: 0 };
      this.size = { w: 0, h: 0 };
      this.pointer = { x: -9999, y: -9999 };
      this.placeholder = null;

      this.onMove = (event) => this.handleMove(event);
      this.onDown = (event) => this.handleDown(event);
      this.onClick = (event) => { event.preventDefault(); event.stopPropagation(); this.dodge(); };
      this.onFocus = () => { this.dodge(); this.btn.blur(); };
      this.onResize = () => this.clampToViewport();

      document.addEventListener('pointermove', this.onMove);
      document.addEventListener('pointerdown', this.onDown, true);
      this.btn.addEventListener('click', this.onClick);
      this.btn.addEventListener('focus', this.onFocus);
      root.addEventListener('resize', this.onResize);
    }

    // ---------- geometry ----------

    /** Where the button is right now (uses the stored position once it is escaping). */
    currentRect() {
      if (!this.escaping) return this.btn.getBoundingClientRect();
      return makeRect(this.pos.x, this.pos.y, this.size.w, this.size.h);
    }

    // ---------- events ----------

    handleMove(event) {
      this.pointer = { x: event.clientX, y: event.clientY };
      if (distanceToRect(event.clientX, event.clientY, this.currentRect()) < this.distance) {
        this.dodge();
      }
    }

    handleDown(event) {
      this.pointer = { x: event.clientX, y: event.clientY };
      if (distanceToRect(event.clientX, event.clientY, this.currentRect()) < this.distance) {
        event.preventDefault();
        this.dodge();
      }
    }

    // ---------- the escape ----------

    dodge() {
      if (!this.escaping) this.startEscaping();

      this.pos = this.pickPosition();
      this.btn.style.left = this.pos.x + 'px';
      this.btn.style.top = this.pos.y + 'px';
      this.count++;

      // Replay the little "pop" animation
      this.btn.classList.remove('is-pop');
      void this.btn.offsetWidth;
      this.btn.classList.add('is-pop');

      if (this.opts.onDodge) this.opts.onDodge(this.count);
    }

    startEscaping() {
      const rect = this.btn.getBoundingClientRect();
      this.size = { w: rect.width, h: rect.height };
      this.pos = { x: rect.left, y: rect.top };

      // Keep the empty space so the Yes button does not jump around
      this.placeholder = document.createElement('span');
      this.placeholder.className = 'no-placeholder';
      this.placeholder.style.width = rect.width + 'px';
      this.placeholder.style.height = rect.height + 'px';
      this.btn.parentNode.insertBefore(this.placeholder, this.btn);

      // Move to <body> so position: fixed is relative to the whole screen
      document.body.appendChild(this.btn);
      this.btn.classList.add('is-escaping');
      this.btn.style.left = this.pos.x + 'px';
      this.btn.style.top = this.pos.y + 'px';
      this.escaping = true;
    }

    /** A random spot far from the pointer, away from the previous spot and from Yes. */
    pickPosition() {
      const { w, h } = this.size;
      const maxX = Math.max(MARGIN, root.innerWidth - w - MARGIN);
      const maxY = Math.max(MARGIN, root.innerHeight - h - MARGIN);
      const yesRect = this.yes.getBoundingClientRect();
      const minFromPointer = this.distance * 1.8;

      for (let attempt = 0; attempt < 40; attempt++) {
        const x = rand(MARGIN, maxX);
        const y = rand(MARGIN, maxY);
        const rect = makeRect(x, y, w, h);

        if (overlaps(rect, yesRect, YES_PADDING)) continue;
        if (distanceToRect(this.pointer.x, this.pointer.y, rect) < minFromPointer) continue;
        if (Math.hypot(x - this.pos.x, y - this.pos.y) < 80) continue;
        return { x, y };
      }

      // Fallback: the screen corner that is farthest from the pointer
      const corners = [
        { x: MARGIN, y: MARGIN }, { x: maxX, y: MARGIN },
        { x: MARGIN, y: maxY },   { x: maxX, y: maxY }
      ];
      corners.sort((a, b) =>
        distanceToRect(this.pointer.x, this.pointer.y, makeRect(b.x, b.y, w, h)) -
        distanceToRect(this.pointer.x, this.pointer.y, makeRect(a.x, a.y, w, h)));
      return corners[0];
    }

    /** Keep the button on screen if the window is resized or the phone is rotated. */
    clampToViewport() {
      if (!this.escaping) return;
      const maxX = Math.max(MARGIN, root.innerWidth - this.size.w - MARGIN);
      const maxY = Math.max(MARGIN, root.innerHeight - this.size.h - MARGIN);
      this.pos.x = Math.min(Math.max(this.pos.x, MARGIN), maxX);
      this.pos.y = Math.min(Math.max(this.pos.y, MARGIN), maxY);
      this.btn.style.left = this.pos.x + 'px';
      this.btn.style.top = this.pos.y + 'px';
    }

    /** Remove listeners and the button itself (called when the question changes). */
    destroy() {
      document.removeEventListener('pointermove', this.onMove);
      document.removeEventListener('pointerdown', this.onDown, true);
      root.removeEventListener('resize', this.onResize);
      this.btn.remove();
      if (this.placeholder) this.placeholder.remove();
    }
  }

  root.Love = root.Love || {};
  root.Love.EscapeButton = EscapeButton;
})(typeof window !== 'undefined' ? window : globalThis);