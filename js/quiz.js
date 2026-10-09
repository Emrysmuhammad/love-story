(function (root) {
  'use strict';

  /**
   * The question flow as plain logic (no DOM): it only knows which question
   * is current and what has been answered, so it is easy to test.
   * Questions are answered strictly one at a time, in order.
   */
  class Quiz {
    constructor(questions) {
      this.questions = questions;
      this.reset();
    }

    reset() {
      this.index = 0;
      this.answers = {};   // question id -> the chosen option object
    }

    get total() {
      return this.questions.length;
    }

    /** The question to show now, or null when everything is answered. */
    current() {
      return this.questions[this.index] || null;
    }

    isFinished() {
      return this.index >= this.questions.length;
    }

    /** Position for the progress bar and the "Question 3 of 12" label. */
    progress() {
      return { current: Math.min(this.index + 1, this.total), total: this.total };
    }

    /** Record the chosen option of the current question and move on. */
    answer(optionIndex) {
      const question = this.current();
      if (!question) throw new Error('The quiz is already finished');

      const option = question.options[optionIndex];
      if (!option) throw new RangeError('No option ' + optionIndex + ' for question ' + question.id);

      this.answers[question.id] = option;
      this.index++;
      return option;
    }
  }

  const api = { Quiz };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.Love = root.Love || {};
    Object.assign(root.Love, api);
  }
})(typeof window !== 'undefined' ? window : globalThis);