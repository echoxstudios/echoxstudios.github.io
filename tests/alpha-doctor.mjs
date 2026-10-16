// The Alpha Doctor: a sustainability check-up beside the seven tools. A private reading, one room at a time.
// This test asserts that it neither stores nor sends anything, reads a sustainable room as such, gives the book's
// prescriptions where a room is not sustainable, renders the reader's text as text, and resets cleanly.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import axe from 'axe-core';
import { launch } from './lib/browser.mjs';

const source = fs.readFileSync(new URL('../tdh/alpha-doctor.html', import.meta.url), 'utf8');
assert.match(source, /connect-src 'none'/, 'the doctor must prohibit network connections');
assert.doesNotMatch(source, /localStorage|sessionStorage|fetch\(|TDHResearch|privacy-choice\.js/, 'the doctor must not persist, send, or join the research counters');
assert.match(source, /Not a real doctor\. Real biscuits\./, 'the doctor must own the joke');
assert.match(source, /not a diagnosis/i, 'the doctor must say it gives no diagnosis');
assert.match(source, /hyperfeminine/, 'the doctor must speak to every way of carrying it');
assert.doesNotMatch(source, /In the long run it brings the dark night|This room is sustainable:/, 'a reflective answer must not assert an inevitable prognosis or verified sustainability');
assert.match(source, /Your answers describe a room that appears sustainable/, 'sustainability is scoped to the answers given');

const pick = (name, value) => `document.querySelector('input[name="${name}"][value="${value}"]').click();`;
const app = await launch();
const ctx = await app.context();
const page = await ctx.page('tdh/alpha-doctor.html', { width: 375 });
async function consult(answers, roomName = '') {
  await page.click('#begin');
  await page.evaluate(pick('room', 'A lover or partner') + `document.querySelector('#room-name').value = ${JSON.stringify(roomName)};`);
  await page.click('#next');
  await page.evaluate(pick('throb', answers.throb) + pick('want', 'To claim') + pick('want', 'To be worshipped'));
  await page.click('#next');
  await page.evaluate(pick('who', answers.who) + pick('path', answers.path));
  await page.click('#next');
  await page.evaluate(pick('you', answers.you));
  await page.click('#next');
  await page.evaluate(pick('them', answers.them));
  await page.click('#next');
  await page.evaluate(pick('field', answers.field));
  await page.click('#next');
}
try {
  await page.waitFor(`(() => { const e = document.querySelector('#intro'); return !!e && e.offsetParent !== null && document.querySelectorAll('input[name="want"]').length === 10; })()`, 15000);
  const storageBefore = await page.evaluate(`JSON.stringify(Object.keys(localStorage).sort())`);

  await consult({ throb: 'Yes, fully', who: 'The people in the room', path: 'I was let in', you: 'It recharges me', them: 'They come out more themselves', field: 'Nobody outside pays for it' }, '<img src=x onerror=alert(1)>');
  assert.equal(await page.visible('#card-screen'), true, 'the reading renders');
  assert.match(await page.text('#card-reading'), /not lonely, not destructive, not isolating, but reinforcing/, 'a sustainable room is read as reinforcing');
  assert.match(await page.text('#card-rx'), /^Tend it\./, 'a sustainable room is tended');
  assert.match(await page.text('#card-want'), /To claim, to be worshipped\. No shame/, 'wants are named without shame');
  assert.equal(await page.evaluate(`document.querySelector('#doctor-card img') === null`), true, 'the reader\'s text is rendered as text');

  await page.click('#restart');
  assert.equal(await page.evaluate(`document.querySelectorAll('input:checked').length + document.querySelector('#room-name').value.length`), 0, 'another room starts clean');
  await page.evaluate(`document.querySelector('#intro').classList.add('active'); document.querySelector('#workbench').classList.remove('active');`);
  await consult({ throb: 'Partly', who: 'An audience outside the room', path: 'I force my way', you: 'I carry it alone', them: 'They come out less themselves', field: 'Someone outside does' });
  const rx = await page.text('#card-rx');
  assert.match(rx, /Win the crown instead of taking it/, 'forcing is answered with the crown that is won');
  assert.match(rx, /who you are really doing this for/, 'an outside audience is named');
  assert.match(rx, /Ask for shelter, or a break/, 'the carrier is given shelter');
  assert.match(rx, /Stop, ask, repair/, 'harm to the other person is the line');
  assert.match(rx, /Keep it in the room/, 'the field does not pay');
  assert.doesNotMatch(await page.text('#card-reading'), /reinforcing/, 'an unsustainable room is not called sustainable');

  assert.equal(ctx.mock.calls.length, 0, 'the doctor made no worker request');
  assert.equal(await page.evaluate(`JSON.stringify(Object.keys(localStorage).sort())`), storageBefore, 'the doctor wrote no persistent storage');
  await page.evaluate(axe.source);
  const violations = JSON.parse(await page.evaluate(`axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } }).then(r => JSON.stringify(r.violations.map(v => v.id)))`));
  assert.deepEqual(violations, [], 'the doctor has no axe WCAG A/AA violations');
  console.log('ok alpha doctor: local-only, six steps, sustainable and unsustainable rooms, the book\'s prescriptions, safe output, reset, accessibility');
} finally {
  await ctx.dispose();
  await app.stop();
}
