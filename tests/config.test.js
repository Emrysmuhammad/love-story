const test = require('node:test');
const assert = require('node:assert/strict');
const Config = require('../js/config.js');

test('there are between 10 and 12 questions', () => {
  assert.ok(Config.QUESTIONS.length >= 10 && Config.QUESTIONS.length <= 12);
});

test('the first question is the date question with Yes and No', () => {
  const first = Config.QUESTIONS[0];
  assert.equal(first.prompt, 'Would you go on a date with me?');
  assert.equal(first.type, 'dodge');
  assert.equal(first.options.filter((o) => o.yes).length, 1);
  assert.equal(first.options.filter((o) => o.no).length, 1);
});

test('question ids are unique', () => {
  const ids = Config.QUESTIONS.map((q) => q.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('every question has a prompt and at least two labelled options', () => {
  Config.QUESTIONS.forEach((q) => {
    assert.ok(q.prompt, q.id + ' needs a prompt');
    assert.ok(q.options.length >= 2, q.id + ' needs two or more options');
    q.options.forEach((o) => assert.ok(o.label, q.id + ' has an option without a label'));
  });
});

test('options used in the summary all have a "say" fragment', () => {
  Config.QUESTIONS.filter((q) => q.id !== 'date' && q.id !== 'ready').forEach((q) => {
    q.options.forEach((o) => assert.ok(o.say, q.id + ' / ' + o.label + ' needs a say fragment'));
  });
});

test('every image has a source and alt text', () => {
  const { hero, quiz, gallery } = Config.IMAGES;
  [hero].concat(quiz, gallery).forEach((image) => {
    assert.ok(image.src.length > 0);
    assert.ok(image.alt && image.alt.length > 10, 'alt text should describe the picture');
  });
});

test('the poem has several stanzas and the music has fallbacks', () => {
  assert.ok(Config.POEM.stanzas.length >= 4);
  assert.ok(Config.MUSIC.SOURCES.length >= 2);
  assert.ok(Config.MUSIC.VOLUME > 0 && Config.MUSIC.VOLUME <= 0.6);
});

test('the No button has plenty of funny messages', () => {
  assert.ok(Config.DODGE.MESSAGES.length >= 5);
});