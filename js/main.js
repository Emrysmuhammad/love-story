(function () {
  'use strict';

  const TRANSITION_MS = 500;    // must match the screen fade in screens.css

  document.addEventListener('DOMContentLoaded', () => {
    const {
      Config, Particles, Music, Images, Quiz, EscapeButton, Confetti, buildSummary
    } = window.Love;

    const $ = (id) => document.getElementById(id);

    const screens = { poem: $('screen-poem'), quiz: $('screen-quiz'), final: $('screen-final') };
    const card = $('quiz-card');
    const quiz = new Quiz(Config.QUESTIONS);

    let current = 'poem';
    let busy = false;          // blocks double clicks during transitions
    let escape = null;         // the active EscapeButton (only on the date question)
    let lastPhoto = -1;
    let celebrateTimer = null;

    // =====================================================
    // Screen transitions
    // =====================================================
    function showScreen(name, done) {
      const from = screens[current];
      const to = screens[name];
      if (from === to) { if (done) done(); return; }

      from.classList.remove('is-active');
      from.classList.add('is-leaving');

      setTimeout(() => {
        from.hidden = true;
        from.classList.remove('is-leaving');

        to.hidden = false;
        void to.offsetWidth;               // restart the CSS transition
        to.classList.add('is-active');
        current = name;

        window.scrollTo(0, 0);
        const heading = to.querySelector('[data-focus]');
        if (heading) heading.focus({ preventScroll: true });
        if (done) done();
      }, TRANSITION_MS);
    }

    // =====================================================
    // Screen 1: the poem
    // =====================================================
    function renderPoem() {
      $('poem-title').textContent = Config.POEM.title;
      $('poem-for').textContent = Config.HER_NAME ? 'For ' + Config.HER_NAME : 'For you';
      $('poem-photo').appendChild(Images.createFigure(Config.IMAGES.hero, 'photo--arch'));

      const body = $('poem-body');
      let lineIndex = 0;
      Config.POEM.stanzas.forEach((lines) => {
        const stanza = document.createElement('p');
        stanza.className = 'stanza';
        lines.forEach((text) => {
          const line = document.createElement('span');
          line.className = 'line';
          line.style.setProperty('--i', lineIndex++);
          line.textContent = text;
          stanza.appendChild(line);
        });
        body.appendChild(stanza);
      });

      // The Continue button waits until the last line has appeared
      $('poem').style.setProperty('--lines', lineIndex);
      $('continue-btn').style.setProperty('--lines', lineIndex);
    }

    // =====================================================
    // Screen 2: the questions
    // =====================================================
    function cleanupEscape() {
      if (escape) { escape.destroy(); escape = null; }
    }

    /** A new photo for every 3 questions. */
    function updatePhoto(index) {
      const photos = Config.IMAGES.quiz;
      const wanted = Math.floor(index / 3) % photos.length;
      if (wanted === lastPhoto) return;

      const slot = $('quiz-photo');
      slot.textContent = '';
      slot.appendChild(Images.createFigure(photos[wanted], 'photo--wide'));
      lastPhoto = wanted;
    }

    function renderQuestion() {
      cleanupEscape();

      const question = quiz.current();
      const { current: number, total } = quiz.progress();

      $('quiz-count').textContent = 'Question ' + number + ' of ' + total;
      $('progress-fill').style.width = (number / total * 100) + '%';
      const bar = $('quiz-progress');
      bar.setAttribute('aria-valuemax', String(total));
      bar.setAttribute('aria-valuenow', String(number));

      $('quiz-question').textContent = question.prompt;
      $('quiz-note').textContent = question.note || '';
      $('dodge-msg').textContent = '';
      updatePhoto(quiz.index);

      const options = $('quiz-options');
      options.textContent = '';
      options.className = 'options';

      if (question.type === 'dodge') {
        renderDodgeQuestion(question, options);
      } else {
        question.options.forEach((option, i) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'option';
          button.style.setProperty('--i', i);
          button.textContent = option.label;
          button.addEventListener('click', () => choose(i, button));
          options.appendChild(button);
        });
      }

      if (current === 'quiz') $('quiz-question').focus({ preventScroll: true });
    }

    /** "Would you go on a date with me?" Yes works, No runs away. */
    function renderDodgeQuestion(question, options) {
      const yesIndex = question.options.findIndex((o) => o.yes);
      const noIndex = question.options.findIndex((o) => o.no);

      const yes = document.createElement('button');
      yes.type = 'button';
      yes.className = 'btn btn--glow btn-yes';
      yes.textContent = question.options[yesIndex].label;
      yes.addEventListener('click', () => choose(yesIndex, yes));

      const no = document.createElement('button');
      no.type = 'button';
      no.className = 'btn btn-no';
      no.textContent = question.options[noIndex].label;

      options.className = 'options options--dodge';
      options.appendChild(yes);
      options.appendChild(no);

      const message = $('dodge-msg');
      escape = new EscapeButton(no, yes, {
        distance: Config.DODGE.DISTANCE,
        onDodge: (count) => {
          const texts = Config.DODGE.MESSAGES;
          message.textContent = texts[(count - 1) % texts.length];
          const scale = Math.min(Config.DODGE.MAX_YES_SCALE, 1 + count * 0.03);
          yes.style.setProperty('--yes-scale', scale.toFixed(2));
        }
      });
    }

    /** The visitor picked an answer: celebrate, then show the next question. */
    function choose(optionIndex, button) {
      if (busy) return;
      busy = true;

      button.classList.add('is-selected');
      const rect = button.getBoundingClientRect();
      Confetti.burst({ count: 26, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });

      quiz.answer(optionIndex);
      cleanupEscape();
      card.classList.add('is-swapping');

      setTimeout(() => {
        if (quiz.isFinished()) {
          card.classList.remove('is-swapping');
          showFinal(() => { busy = false; });
          return;
        }

        renderQuestion();
        // Slide the new question in from the right
        card.classList.remove('is-swapping');
        card.classList.add('is-entering');
        void card.offsetWidth;
        card.classList.remove('is-entering');
        busy = false;
      }, 420);
    }

    // =====================================================
    // Screen 3: the personalized ending
    // =====================================================
    function showFinal(done) {
      const summary = buildSummary(Config.QUESTIONS, quiz.answers, { herName: Config.HER_NAME });

      // The message, one sentence at a time
      const paragraph = $('final-summary');
      paragraph.textContent = '';
      summary.sentences.forEach((text, i) => {
        const span = document.createElement('span');
        span.className = 'sentence';
        span.style.setProperty('--i', i);
        span.textContent = text + ' ';
        paragraph.appendChild(span);
      });

      // The date plan card
      const list = $('plan-list');
      list.textContent = '';
      summary.details.forEach((item) => {
        const term = document.createElement('dt');
        term.textContent = item.label;
        const value = document.createElement('dd');
        value.textContent = item.value;
        list.appendChild(term);
        list.appendChild(value);
      });

      // Photos
      const gallery = $('final-gallery');
      gallery.textContent = '';
      Config.IMAGES.gallery.forEach((photo) => {
        gallery.appendChild(Images.createFigure(photo, 'photo--square'));
      });

      // Closing words and signature
      const closing = $('final-closing');
      closing.textContent = '';
      Config.FINAL.closing.forEach((text) => {
        const p = document.createElement('p');
        p.textContent = text;
        closing.appendChild(p);
      });
      $('final-sign').textContent = Config.HIS_NAME ? 'Yours, ' + Config.HIS_NAME : 'Yours, always';

      showScreen('final', done);

      // Celebration: confetti hearts, more floating particles, repeating bursts
      setTimeout(() => {
        Particles.setMode('celebrate');
        Confetti.burst({ count: 110 });
        celebrateTimer = setInterval(() => {
          if (current === 'final') {
            Confetti.burst({ count: 24, x: window.innerWidth * (0.15 + Math.random() * 0.7), y: window.innerHeight * 0.3 });
          }
        }, 5000);
      }, TRANSITION_MS + 150);
    }

    // =====================================================
    // Buttons
    // =====================================================
    $('continue-btn').addEventListener('click', () => {
      if (busy) return;
      busy = true;
      renderQuestion();
      showScreen('quiz', () => { busy = false; });
    });

    $('replay-btn').addEventListener('click', () => {
      if (busy) return;
      busy = true;
      clearInterval(celebrateTimer);
      Particles.setMode('calm');
      quiz.reset();
      lastPhoto = -1;
      renderQuestion();
      showScreen('quiz', () => { busy = false; });
    });

    // =====================================================
    // Start everything
    // =====================================================
    renderPoem();
    Particles.start($('particles'));
    Music.init(Config.MUSIC, $('music-btn'), $('music-volume'));

    window.love = { quiz, Config };   // handy for debugging in the console
  });
})();