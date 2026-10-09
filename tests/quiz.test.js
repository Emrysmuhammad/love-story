const test = require('node:test');
const assert = require('node:assert/strict');
const { Quiz } = require('../js/quiz.js');

function sampleQuestions() {
  return [
    { id: 'a', options: [{ label: 'A1' }, { label: 'A2' }] },
    { id: 'b', options: [{ label: 'B1' }, { label: 'B2' }, { label: 'B3' }] }
  ];
}

test('starts on the first question only', () => {
  const quiz = new Quiz(sampleQuestions());
  assert.equal(quiz.current().id, 'a');
  assert.equal(quiz.total, 2);
  assert.equal(quiz.isFinished(), false);
});

test('answering records the chosen option and shows the next question', () => {
  const quiz = new Quiz(sampleQuestions());
  const option = quiz.answer(1);
  assert.equal(option.label, 'A2');
  assert.equal(quiz.answers.a.label, 'A2');
  assert.equal(quiz.current().id, 'b');
});

test('finishes after the last question', () => {
  const quiz = new Quiz(sampleQuestions());
  quiz.answer(0);
  quiz.answer(2);
  assert.equal(quiz.isFinished(), true);
  assert.equal(quiz.current(), null);
  assert.equal(quiz.answers.b.label, 'B3');
});

test('progress counts questions and never passes the total', () => {
  const quiz = new Quiz(sampleQuestions());
  assert.deepEqual(quiz.progress(), { current: 1, total: 2 });
  quiz.answer(0);
  assert.deepEqual(quiz.progress(), { current: 2, total: 2 });
  quiz.answer(0);
  assert.deepEqual(quiz.progress(), { current: 2, total: 2 });
});

test('an invalid option index is rejected and does not advance', () => {
  const quiz = new Quiz(sampleQuestions());
  assert.throws(() => quiz.answer(7), RangeError);
  assert.equal(quiz.current().id, 'a');
});

test('answering after the quiz is finished throws', () => {
  const quiz = new Quiz(sampleQuestions());
  quiz.answer(0);
  quiz.answer(0);
  assert.throws(() => quiz.answer(0));
});

test('reset clears answers and returns to the first question', () => {
  const quiz = new Quiz(sampleQuestions());
  quiz.answer(0);
  quiz.reset();
  assert.equal(quiz.current().id, 'a');
  assert.deepEqual(quiz.answers, {});
});