// Free-text answers become grammatical result sentences whatever form they take (tdh/sentence-fit.js).
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const F = createRequire(import.meta.url)('../tdh/sentence-fit.js');

const C = 'You are most fully yourself sexually when you are';
const V = 'You feel most confirmed in your sexual self when the other person';
const VQ = 'You feel most confirmed in your sexual self by what the other person does, which you put like this:';
const R = 'If you could ask one thing, you would ask:';
const T = 'The thing you most want to be told is this:';
const cases = [
  [C, 'unhurried', 'complement', null, `${C} unhurried.`],
  [C, 'Unhurried.', 'complement', null, `${C} unhurried.`],
  [C, 'I am unhurried', 'complement', null, `${C} unhurried.`],
  [C, "I'm like the last one awake in a quiet house", 'complement', null, `${C} like the last one awake in a quiet house.`],
  [C, 'When I feel most fully myself sexually, I am calm and certain.', 'complement', null, `${C} calm and certain.`],
  [C, '  ...wanted  ', 'complement', null, `${C} wanted.`],
  [C, '"held"', 'complement', null, `${C} held.`],
  [C, 'calm. And seen. Finally.', 'complement', null, `${C}, in your own words, “Calm. And seen. Finally.”`],
  ['It is', "that I'm paying close attention even when quiet", 'complement', null, 'It is that you are paying close attention even when quiet.'],
  ['It is', 'It is my patience with myself', 'complement', null, 'It is your patience with yourself.'],
  ['It is', "she holds me when I can't", 'complement', null, 'It is, in your own words, “She holds me when I can’t.”'],
  [V, 'notices the thing I didn\'t say out loud', 'verb', VQ, `${V} notices the thing you didn't say out loud.`],
  [V, 'notice the thing I didn\'t say', 'verb', VQ, `${V} notices the thing you didn't say.`],
  [V, 'they notice me', 'verb', VQ, `${V} notices you.`],
  [V, 'When they really see me', 'verb', VQ, `${V} really sees you.`],
  [V, 'he is patient with me', 'verb', VQ, `${V} is patient with you.`],
  [V, "They're gentle and firm", 'verb', VQ, `${V} is gentle and firm.`],
  [V, "they don't rush", 'verb', VQ, `${V} doesn't rush.`],
  [V, 'kisses me slowly', 'verb', VQ, `${V} kisses you slowly.`],
  [V, 'stays. Even after.', 'verb', VQ, `${VQ} “Stays. Even after.”`],
  [R, 'ask me before you assume', 'request', R, `${R} “Ask me before you assume.”`],
  [R, 'what do you need from me', 'request', R, `${R} “What do you need from me?”`],
  [R, 'to slow down', 'request', R, `${R} “Slow down.”`],
  [T, "you don't have to earn this", 'told', T, `${T} “You don’t have to earn this.”`],
  [T, 'that I am enough', 'told', T, `${T} “You are enough.”`],
  [T, "I'm proud of you", 'told', T, `${T} “I’m proud of you.”`],
];
let n = 0;
for (const [label, answer, slot, q, expected] of cases) { assert.equal(F.sentence(label, answer, slot, q), expected, JSON.stringify(answer)); n++; }
assert.equal(F.sentence(C, '   ', 'complement'), null, 'an empty answer produces no sentence');
assert.equal(F.sentence(C, '...', 'complement'), null, 'punctuation alone produces no sentence');
const long = Array.from({ length: 45 }, (_, i) => 'word' + i).join(' ');
assert.equal(F.fit(long, 'complement').mode, 'quote', 'a very long answer is quoted rather than forced inline');
assert.equal(F.fit('<b>x</b>', 'quote').text.includes('<b>'), true, 'the fitter returns text; callers escape it');

// The final proof: whatever form an answer takes, the finished sentence passes check().
const messy = {
  complement: ['am calm', 'i am calm', 'calm ,and  seen', 'calm and and seen', 'calm!!', 'im calm', 'when im calm', 'SEEN', 'I dont know', 'Hard to say', 'wanted,seen , held', 'calm. and seen', 'in an university', 'the the real me', 'unafraid man', 'a unafraid man', 'she holds me', 'like  i  matter ..'],
  verb: ['listens to me and i feel safe', 'look at me like i matter', 'takes charge,holds me', 'does what i ask', 'me', 'Me feel safe', 'makes me feel like im enough', 'not sure', 'they wants me', 'u see me'],
  request: ['can u slow down', 'to slow down', 'ask me first..'],
  told: ['your enough', 'that i am loved', 'you are enough..', 'ur safe with me'],
};
const labels = { complement: [C, 'The version of yourself you most want to feel like is', 'It is'], verb: [V], request: [R], told: [T] };
for (const [slot, answers] of Object.entries(messy)) for (const label of labels[slot]) for (const answer of answers) {
  const out = F.sentence(label, answer, slot, slot === 'verb' ? VQ : undefined);
  assert.deepEqual(F.check(out), [], `${JSON.stringify(answer)} -> ${out}`); n++;
}
const fixed = [
  [C, 'am calm', 'complement', `${C} calm.`],
  [C, 'when im calm', 'complement', `${C} calm.`],
  [C, 'calm ,and  seen', 'complement', `${C} calm, and seen.`],
  [C, 'SEEN', 'complement', `${C} seen.`],
  [C, 'I dont know', 'complement', `${C} — this you have left open for now: “I don’t know.”`],
  ['The version of yourself you most want to feel like is', 'unafraid man', 'complement', 'The version of yourself you most want to feel like is an unafraid man.'],
  [V, 'listens to me and i feel safe', 'verb', `${V} listens to you and you feel safe.`],
  [V, 'me', 'verb', `${VQ} “Me.”`],
  [R, 'can u slow down', 'request', `${R} “Can you slow down?”`],
  [T, 'your enough', 'told', `${T} “You’re enough.”`],
];
for (const [label, answer, slot, expected] of fixed) { assert.equal(F.sentence(label, answer, slot, slot === 'verb' ? VQ : undefined), expected, answer); n++; }
assert.deepEqual(F.check('you are am calm'), ['no capital at the start', 'no closing punctuation', 'doubled verb'], 'check() names what is wrong');
assert.equal(F.proof('i think its  about trust,and being seen', 'statement'), 'I think it’s about trust, and being seen.');
assert.equal(F.proof('a old leather collar', 'fragment'), 'an old leather collar');
assert.equal(F.proof('We dont rush .We stay\nand we return', 'statement'), 'We don’t rush. We stay.\nAnd we return.');
console.log(`${n + 7} sentence-fit checks passed`);
