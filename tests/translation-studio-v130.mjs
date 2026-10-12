// Local v126 candidate: a private reading tool. This test asserts that it neither stores nor sends participant material.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import axe from 'axe-core';
import { launch } from './lib/browser.mjs';

const source = fs.readFileSync(new URL('../tdh/v130/translation-studio.html', import.meta.url), 'utf8');
assert.match(source, /connect-src 'none'/, 'candidate must prohibit network connections');
assert.doesNotMatch(source, /localStorage|sessionStorage|fetch\(/, 'candidate must not persist or send participant material');
assert.match(source, /No hypothesis and no action/, 'candidate must preserve a no-action outcome');
assert.match(source, /not standing permission/i, 'candidate must reject inferred entitlement');

const app = await launch();
const ctx = await app.context();
const page = await ctx.page('tdh/v130/translation-studio.html', { width: 375 });
try {
  const storageBefore = await page.evaluate(`JSON.stringify(Object.keys(localStorage).sort())`);
  assert.equal(await page.visible('#intro'), true, 'intro is visible');
  assert.equal(await page.text('#stage-number'), '1 / 6', 'six-stage conversation starts at the offer');
  await page.click('#begin');
  assert.equal(await page.visible('#workbench'), true, 'workbench opens locally');
  await page.evaluate(`document.querySelector('#offering').value = '<img src=x onerror=alert(1)>'; document.querySelector('input[name="offering-kind"][value="Object"]').checked = true`);
  await page.click('#next');
  await page.evaluate(`document.querySelector('#possibility').value = 'recognition';`);
  await page.click('#next');
  await page.evaluate(`document.querySelector('#reflection').value = 'I heard recognition.';`);
  await page.click('#next');
  await page.evaluate(`document.querySelector('input[name="recognition"][value="Uncertain"]').checked = true`);
  await page.click('#next');
  await page.click('#hypothesis-none');
  await page.click('#next');
  await page.evaluate(`document.querySelector('input[name="debrief"][value="Stopped"]').checked = true`);
  await page.click('#next');
  assert.equal(await page.visible('#card-screen'), true, 'card renders after voluntary stages');
  assert.match(await page.text('#card-hypothesis'), /No hypothesis and no action/, 'no-action choice is retained');
  assert.equal(await page.evaluate(`document.querySelector('#translation-card img') === null`), true, 'participant text is rendered as text, never markup');
  assert.equal(ctx.mock.calls.length, 0, 'candidate made no worker request');
  assert.equal(await page.evaluate(`JSON.stringify(Object.keys(localStorage).sort())`), storageBefore, 'candidate wrote no persistent storage');
  await page.evaluate(axe.source);
  const violations = JSON.parse(await page.evaluate(`axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } }).then(r => JSON.stringify(r.violations.map(v => v.id)))`));
  assert.deepEqual(violations, [], 'candidate has no axe WCAG A/AA violations');
  await page.click('#restart');
  assert.equal(await page.visible('#intro'), true, 'restart returns to the local introduction');
  assert.equal(await page.evaluate(`document.querySelector('#offering').value`), '', 'restart clears the canvas');
  console.log('ok translation studio: local-only, six stages, no-action, safe output, reset, accessibility');
} finally {
  await ctx.dispose();
  await app.stop();
}
