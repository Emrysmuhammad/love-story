(function (root) {
  'use strict';

  /**
   * Show a styled card containing the alt text when a photo cannot load,
   * so the intended picture is still described to the person.
   */
  function showFallback(img, photo) {
    const fallback = document.createElement('div');
    fallback.className = 'photo__fallback';
    fallback.setAttribute('role', 'img');
    fallback.setAttribute('aria-label', photo.alt);

    const heart = document.createElement('span');
    heart.className = 'photo__fallback-heart';
    heart.textContent = '\u2665';
    heart.setAttribute('aria-hidden', 'true');

    const text = document.createElement('span');
    text.textContent = photo.alt;

    fallback.appendChild(heart);
    fallback.appendChild(text);
    img.replaceWith(fallback);
  }

  /**
   * Build a <figure> with a photo. Every image gets alt text and a fallback.
   * `className` adds a shape class such as 'photo--arch' or 'photo--wide'.
   */
  function createFigure(photo, className) {
    const figure = document.createElement('figure');
    figure.className = 'photo ' + (className || '');

    const img = document.createElement('img');
    img.alt = photo.alt;
    img.loading = photo.eager ? 'eager' : 'lazy';
    img.decoding = 'async';
    img.referrerPolicy = 'no-referrer';
    img.addEventListener('error', () => showFallback(img, photo));
    img.src = photo.src;
    figure.appendChild(img);

    if (photo.caption) {
      const caption = document.createElement('figcaption');
      caption.textContent = photo.caption;
      figure.appendChild(caption);
    }
    return figure;
  }

  root.Love = root.Love || {};
  root.Love.Images = { createFigure };
})(typeof window !== 'undefined' ? window : globalThis);