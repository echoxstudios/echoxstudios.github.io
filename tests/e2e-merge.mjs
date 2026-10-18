// One code for all tests: a result can be saved under a code from another test; the code it had is removed.
// Run: node tests/e2e-merge.mjs
import assert from 'node:assert/strict';
import { launch, CHROME } from './lib/browser.mjs';
import { TOOLS, completeTool } from './lib/drive.mjs';
if (!CHROME) { console.log('e2e merge test skipped: Chrome not found'); process.exit(0); }

const b = await launch();
let passed = 0;
const t = async (name, fn) => { try { await fn(); passed++; console.log('ok  ', name); } catch (e) { console.log('FAIL', name, '\n    ', e.message.split('\n').slice(0, 4).join('\n     ')); await b.stop(); process.exit(1); } };
const choose = async (p) => {
  await p.waitFor(`!!document.querySelector('#tdh-research-check')`, 8000);
  await p.evaluate(`document.querySelector('#tdh-age-check').click(); document.querySelector('#tdh-research-check').click()`);
  await p.click('.tdh-choice-button[data-mode="remote"]'); await p.click('.tdh-choice-confirm');
  await p.waitFor(`!document.querySelector('.tdh-privacy-backdrop')`, 5000);
};
const codeOf = async (p) => { await p.waitFor(`/[A-Z0-9]{12}/.test((document.querySelector('#code-box')||document.querySelector('#res-code')||{}).textContent||'')`, 12000); return (await p.evaluate(`(document.querySelector('#code-box')||document.querySelector('#res-code')).textContent.trim()`)); };

const c = await b.context({ seed: { tdh_storage_mode: '', tdh_adult_confirmed: '', tdh_research_optin: '' } });
let codeA, codeB, p2;
await t('two tests, two different codes', async () => {
  const p1 = await c.page(TOOLS[0].file); await choose(p1); await completeTool(p1, TOOLS[0]); codeA = await codeOf(p1);
  p2 = await c.page(TOOLS[1].file); await completeTool(p2, TOOLS[1]); codeB = await codeOf(p2);
  assert.notEqual(codeA, codeB);
  assert.ok(c.mock.profiles.has('t1' + codeA) && c.mock.profiles.has('t2' + codeB));
});
await t('the second result is saved under the first code and the old code is removed', async () => {
  await p2.waitFor(`!!document.querySelector('#tdh-merge')`, 8000);
  await p2.evaluate(`document.querySelector('#tdh-merge').open = true; document.querySelector('#tdh-merge-code').value = '${codeA}'; document.querySelector('#tdh-merge-go').click()`);
  await p2.waitFor(`/Saved\\./.test(document.querySelector('#tdh-merge-msg').textContent)`, 8000);
  assert.ok(c.mock.profiles.has('t2' + codeA), 'tool 2 saved under the first code');
  assert.ok(c.mock.profiles.has('t1' + codeA), 'tool 1 still there');
  assert.ok(!c.mock.profiles.has('t2' + codeB), 'the old code is gone');
  assert.equal((await codeOf(p2)), codeA);
});
await t('a code that is too short is refused and nothing changes', async () => {
  const p3 = await c.page(TOOLS[2].file); await completeTool(p3, TOOLS[2]); const codeC = await codeOf(p3);
  await p3.waitFor(`!!document.querySelector('#tdh-merge')`, 8000);
  await p3.evaluate(`document.querySelector('#tdh-merge-code').value = 'ABC'; document.querySelector('#tdh-merge-go').click()`);
  assert.match(await p3.text('#tdh-merge-msg'), /twelve/);
  assert.ok(c.mock.profiles.has('t3' + codeC));
});
await t('the combined profile page opens all tests from the one code', async () => {
  const q = await c.page('tdh/profile.html?code=' + codeA);
  await q.sleep(2500);
  const text = await q.evaluate(`document.body.innerText`);
  assert.ok(!/None of those codes resolved/.test(text), 'the one code resolves');
  assert.ok(!/No result found for that code/.test(text) || /Aspirational|Trigger|Gradient/i.test(text), 'results from more than one test are shown');
});
console.log(`e2e merge: ${passed} passed`);
await b.stop();
