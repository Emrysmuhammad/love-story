const test = require('node:test');
const assert = require('node:assert/strict');
const Config = require('../js/config.js');
const { buildSummary } = require('../js/summary.js');

const questions = Config.QUESTIONS;

function option(id, label) {
  const question = questions.find((q) => q.id === id);
  return question.options.find((o) => o.label === label);
}

/** Answer every question with its first option. */
function firstOptionAnswers() {
  const answers = {};
  questions.forEach((q) => { answers[q.id] = q.options[0]; });
  return answers;
}

test('a full set of answers builds a clean message', () => {
  const { paragraph } = buildSummary(questions, firstOptionAnswers());
  assert.ok(paragraph.startsWith("Perfect! I've taken notes on everything."));
  assert.ok(paragraph.endsWith("I can't wait to spend time with you."));
  assert.ok(!/undefined|null/.test(paragraph));
  assert.ok(!/  /.test(paragraph), 'no double spaces');
});

test('the chosen day, time, flowers and treats appear in the message', () => {
  const answers = {
    day: option('day', 'Saturday'),
    time: option('time', 'Evening'),
    flower: option('flower', 'Rose'),
    gift: option('gift', 'Chocolate')
  };
  const { paragraph } = buildSummary(questions, answers);
  assert.ok(paragraph.includes("I'll pick you up on Saturday in the evening."));
  assert.ok(paragraph.includes('beautiful roses'));
  assert.ok(paragraph.includes("there's plenty of chocolate waiting for you"));
});

test('place is joined to the pickup sentence when both are known', () => {
  const answers = {
    day: option('day', 'Friday'),
    time: option('time', 'Afternoon'),
    place: option('place', 'Beach walk')
  };
  const { paragraph } = buildSummary(questions, answers);
  assert.ok(paragraph.includes("I'll pick you up on Friday in the afternoon, and we'll head to the beach"));
});

test('unanswered questions are skipped without gaps', () => {
  const { sentences } = buildSummary(questions, {});
  assert.equal(sentences.length, 3); // opening + two closing sentences
});

test("her name is used when it is provided", () => {
  const { sentences } = buildSummary(questions, {}, { herName: ' Amara ' });
  assert.equal(sentences[0], "Perfect, Amara! I've taken notes on everything.");
});

test('details list every answered question in order', () => {
  const answers = {
    time: option('time', 'Evening'),
    day: option('day', 'Saturday')
  };
  const { details } = buildSummary(questions, answers);
  assert.deepEqual(details, [
    { label: 'Day', value: 'Saturday' },
    { label: 'Time', value: 'Evening' }
  ]);
});