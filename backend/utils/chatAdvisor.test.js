import test from 'node:test';
import assert from 'node:assert/strict';
import { answerChatQuestion } from './chatAdvisor.js';

test('explains rent shock for San Francisco relocation', () => {
  const answer = answerChatQuestion('Why is rent the biggest shock in San Francisco?');

  assert.match(answer.message, /housing/i);
  assert.match(answer.message, /280%/);
  assert.match(answer.message, /San Francisco/i);
});

test('explains Travel Affordability Score', () => {
  const answer = answerChatQuestion('What does Travel Affordability Score mean?');

  assert.match(answer.message, /feels like/i);
  assert.match(answer.message, /home/i);
});

test('answers what is cheaper in the US than India', () => {
  const answer = answerChatQuestion('What is cheaper in the US than India?');

  assert.match(answer.message, /electronics/i);
  assert.match(answer.message, /iPhone/i);
});
