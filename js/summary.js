(function (root) {
  'use strict';

  /**
   * Turns the chosen answers into a personalized romantic message.
   * Pure logic with no DOM, so it can be tested. Questions that were not
   * answered are simply left out, so the text never contains gaps.
   *
   * @param {Array}  questions  the question list from config
   * @param {Object} answers    question id -> chosen option
   * @param {Object} opts       { herName }
   * @returns {{ sentences: string[], paragraph: string, details: {label, value}[] }}
   */
  function buildSummary(questions, answers, opts) {
    const options = opts || {};
    const say = (id) => (answers[id] && answers[id].say ? answers[id].say : '');

    const herName = options.herName ? String(options.herName).trim() : '';
    const sentences = [
      herName
        ? 'Perfect, ' + herName + "! I've taken notes on everything."
        : "Perfect! I've taken notes on everything."
    ];

    // When and where
    const when = [say('day'), say('time')].filter(Boolean).join(' ');
    const place = say('place');
    if (when && place) {
      sentences.push("I'll pick you up " + when + ", and we'll head to " + place + '.');
    } else if (when) {
      sentences.push("I'll pick you up " + when + '.');
    } else if (place) {
      sentences.push("We'll head to " + place + '.');
    }

    // Flowers and treats
    const flower = say('flower');
    const gift = say('gift');
    if (flower && gift) {
      sentences.push("I'll bring " + flower + ", and I'll make sure there's " + gift + ' waiting for you.');
    } else if (flower) {
      sentences.push("I'll bring " + flower + ' for you.');
    } else if (gift) {
      sentences.push("I'll make sure there's " + gift + ' waiting for you.');
    }

    // The rest of the plan
    if (say('music')) sentences.push("We'll listen to " + say('music') + ' along the way.');
    if (say('perfect')) sentences.push("To make it perfect, I'll make sure there's " + say('perfect') + '.');
    if (say('dessert')) sentences.push("We'll share " + say('dessert') + ' for dessert.');
    if (say('outfit')) sentences.push("I'll wear " + say('outfit') + ' just to impress you.');
    if (say('hugs')) sentences.push("As for hugs, I'll gladly take " + say('hugs') + '.');

    // Closing
    sentences.push('Until then, keep looking as beautiful as you always do.');
    sentences.push("I can't wait to spend time with you.");

    // The "Our date plan" card: every answered question, in order
    const details = [];
    questions.forEach((question) => {
      const answer = answers[question.id];
      if (answer) details.push({ label: question.detail || question.id, value: answer.label });
    });

    return { sentences: sentences, paragraph: sentences.join(' '), details: details };
  }

  const api = { buildSummary };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.Love = root.Love || {};
    Object.assign(root.Love, api);
  }
})(typeof window !== 'undefined' ? window : globalThis);