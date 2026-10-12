// Translation Studio: the companion for two beside the seven tools. A private reading canvas.
// This test asserts that it neither stores nor sends participant material, keeps its no-action outcome,
// renders participant text as text, and computes shared ground only from what both people chose.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import axe from 'axe-core';
import { launch } from './lib/browser.mjs';

const source = fs.readFileSync(new URL('../tdh/translation-studio.html', import.meta.url), 'utf8');
assert.match(source, /connect-src 'none'/, 'studio must prohibit network connections');
assert.doesNotMatch(source, /localStorage|sessionStorage|fetch\(|TDHResearch|privacy-choice\.js/, 'studio must not persist, send, or join the research counters');
assert.match(source, /No hypothesis and no action/, 'studio must preserve a no-action outcome');
assert.match(source, /not standing permission/i, 'studio must reject inferred entitlement');
assert.match(source, /never part of the research counters/i, 'studio must say it is never part of the research counters');
assert.equal((source.match(/<span class="ornament" aria-hidden="true">✦<\/span>/g) || []).length, 3, 'studio must retain the three intentional ✦ ornaments');
assert.match(source, /\.ornament\s*\{[^}]*--gold/, 'studio must retain the gold ornament treatment');

const tick = (name, value) => `document.querySelector('input[name="${name}"][value="${value}"]').click();`;
const app = await launch();
const ctx = await app.context();
const page = await ctx.page('tdh/translation-studio.html', { width: 375 });
try {
  // Wait for the page to render (CI runners are slower than the helper's fixed 250 ms after navigation).
  await page.waitFor(`(() => { const e = document.querySelector('#intro'); return !!e && e.offsetParent !== null && document.querySelectorAll('[data-tags] input').length === 24; })()`, 15000);
  const storageBefore = await page.evaluate(`JSON.stringify(Object.keys(localStorage).sort())`);
  assert.equal(await page.visible('#intro'), true, 'intro is visible');
  assert.equal(await page.text('#stage-number'), '1 / 8', 'eight-stage conversation starts at the offer');
  await page.click('#begin');
  assert.equal(await page.visible('#workbench'), true, 'workbench opens locally');
  await page.evaluate(`document.querySelector('#offering').value = '<img src=x onerror=alert(1)>'; ${tick('offering-kind', 'Object')}`);
  await page.click('#next');
  await page.evaluate(`document.querySelector('#grammar').value = 'usually read as infantile'; document.querySelector('#possibility').value = 'rest when life is too much'; ${tick('possibility-tag', 'Comfort')} ${tick('possibility-tag', 'Play')} ${tick('possibility-tag', 'Rest')}`);
  await page.click('#next');
  await page.evaluate(`document.querySelector('#reflection').value = 'I heard rest.'; ${tick('meet-tag', 'Play')} ${tick('meet-tag', 'Care')}`);
  await page.click('#next');
  await page.evaluate(tick('recognition', 'Uncertain'));
  await page.click('#next');
  await page.evaluate(`document.querySelector('#brings-first').value = 'a history\\n<b>a sensation</b>'; document.querySelector('#brings-second').value = 'a joke'; document.querySelector('#overlap').value = 'a game of care'; document.querySelector('#room-name').value = 'The nursery of the absurd';`);
  await page.click('#next');
  await page.click('#hypothesis-none');
  await page.click('#next');
  await page.evaluate(`document.querySelector('#renewal').value = 'a new city on foot';`);
  await page.click('#next');
  await page.evaluate(tick('debrief', 'Stopped'));
  await page.click('#next');
  assert.equal(await page.visible('#card-screen'), true, 'card renders after voluntary stages');
  assert.match(await page.text('#card-hypothesis'), /No hypothesis and no action/, 'no-action choice is retained');
  assert.equal(await page.text('#card-shared'), 'Play.', 'shared ground is only what both people chose');
  assert.match(await page.text('#card-grammar'), /usually read as infantile/, 'public grammar is kept apart from the personal account');
  assert.match(await page.text('#card-room'), /The nursery of the absurd/, 'the named room is on the card');
  assert.match(await page.text('#card-renewal'), /a new city on foot/, 'renewal is on the card');
  assert.equal(await page.evaluate(`document.querySelector('#translation-card img, #translation-card b') === null`), true, 'participant text is rendered as text, never markup');
  assert.equal(ctx.mock.calls.length, 0, 'studio made no worker request');
  assert.equal(await page.evaluate(`JSON.stringify(Object.keys(localStorage).sort())`), storageBefore, 'studio wrote no persistent storage');
  await page.evaluate(axe.source);
  const violations = JSON.parse(await page.evaluate(`axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } }).then(r => JSON.stringify(r.violations.map(v => v.id)))`));
  assert.deepEqual(violations, [], 'studio has no axe WCAG A/AA violations');
  await page.click('#restart');
  assert.equal(await page.visible('#intro'), true, 'restart returns to the local introduction');
  assert.equal(await page.evaluate(`document.querySelector('#offering').value + document.querySelector('#room-name').value + document.querySelectorAll('input[type=checkbox]:checked').length`), '0', 'restart clears the canvas');

  // No overlap is a complete answer, never a refusal.
  await page.click('#begin');
  await page.click('#next');
  await page.evaluate(tick('possibility-tag', 'Authority'));
  await page.click('#next');
  await page.evaluate(tick('meet-tag', 'Humour'));
  for (let i = 0; i < 6; i++) await page.click('#next');
  assert.match(await page.text('#card-shared'), /Not refused: the key not yet found/, 'no overlap is named without blame');
  console.log('ok translation studio: local-only, eight stages, shared ground, no-action, safe output, reset, accessibility');
} finally {
  await ctx.dispose();
  await app.stop();
}
