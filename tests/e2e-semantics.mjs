// Rendered meaning, keyboard operation and restored-content safety, with mocked services.
import assert from 'node:assert/strict';
import { launch, CHROME } from './lib/browser.mjs';
if (!CHROME) throw new Error('Chrome is required for semantic browser checks');
const browser = await launch();
let checks = 0;
try {
  for (const width of [375, 768, 1280]) {
    const context = await browser.context({ width, webdriver:true });
    const page = await context.page('tdh/tool-2-aspirational-self.html');
    const poles = await page.evaluate(`(() => {
      const base = { dom:50, pow:50, pur:50, see:50, wor:50, tra:50, sin:50 };
      const cy = v => {
        const host = document.createElement('div'); host.innerHTML = buildAxisMap(v);
        return Number(host.querySelector('circle').getAttribute('cy'));
      };
      return [cy({...base,see:0,wor:0}), cy(base), cy({...base,see:100,wor:100})];
    })()`);
    assert.ok(poles[0] < poles[1] && poles[1] < poles[2]);
    console.log(`ok visibility map matches slider poles at ${width}px`); checks++;
    await page.goto('tdh/tool-1-trigger-gradient.html');
    const recommendations = await page.evaluate(`(() => ['V','E','T','I'].map(ch => ({
      ch, html:buildRecs(Object.fromEntries(['V','E','T','I'].map(id=>[id,id===ch?70:10]))),
      expected:READING_RECS[ch].map(r=>TDH_BOOK.reference(r.route))
    })))()`);
    for (const {html,expected} of recommendations) {
      assert.equal(expected.length, 2);
      for (const label of expected) assert.ok(html.includes(label), label);
    }
    assert.equal(await page.evaluate('TDH_BOOK.releaseEdition'), 'v144');
    assert.deepEqual(page.errors, []);
    console.log(`ok all four reading routes resolve to the released book at ${width}px`); checks++;
    await page.goto('tdh/tool-4-dark-night.html');
    const failureRoutes = await page.evaluate(`(() => {
      let withdrawnRejected = false;
      try { TDH_BOOK.get('dark-night','v125'); }
      catch (error) { withdrawnRejected = /Unknown book route or edition/.test(error.message); }
      return {
        refs:QUESTIONS.filter(q=>['F8','F9'].includes(q.id)).map(q=>q.ref),
        release:TDH_BOOK.get('dark-night'), withdrawnRejected
      };
    })()`);
    assert.match(failureRoutes.refs[0], /Chapter One, Section VII — Performance Without Presence/);
    assert.match(failureRoutes.refs[1], /Chapter One, Section I — The Anatomy of Drift/);
    assert.equal(failureRoutes.release.edition,'v144');
    assert.equal(failureRoutes.withdrawnRejected,true);
    assert.deepEqual(page.errors, []);
    console.log(`ok failure references use v144 and reject the withdrawn edition at ${width}px`); checks++;
    await page.goto('tdh/tool-6-threshold.html');
    const tied = await page.evaluate(`(() => {
      resp = { T1:4, T2:4, T3:4, T4:4 };
      return buildReflection(determineThreshold(), 'multiple', 'comparable');
    })()`);
    assert.match(tied, /ratings are tied/);
    assert.match(tied, /leaving a dynamic/);
    assert.doesNotMatch(tied, /do not usually arrive/);
    console.log(`ok tied thresholds remain visible at ${width}px`); checks++;
    await page.goto('tdh/tool-5-protocol-designer.html');
    const draft = await page.evaluate(`(() => {
      answers = { B1:'solo', B2:'3', C1:'both', C2:'imagined', A3:'I', D1:'4', D2:'never' };
      return buildProtocolDoc();
    })()`);
    assert.match(draft, /optional drafts for agreement/);
    assert.match(draft, /medical care, money, movement, outside relationships, and consent are never rewards/);
    assert.doesNotMatch(draft, /class="ritual-name">The (Withholding|Inspection|Ritual of Massage)/);
    console.log(`ok solo protocol remains optional and protects basic needs at ${width}px`); checks++;
    await page.goto('tdh/tool-7-liturgy-matrix.html');
    await page.click('#btn-start');
    await page.evaluate(`document.querySelector('#lit-M1').focus()`);
    await page.call('Input.dispatchKeyEvent', { type:'keyDown', key:'Enter', code:'Enter', windowsVirtualKeyCode:13 });
    await page.call('Input.dispatchKeyEvent', { type:'keyUp', key:'Enter', code:'Enter', windowsVirtualKeyCode:13 });
    assert.equal(await page.evaluate(`document.querySelector('#lit-M1').getAttribute('aria-pressed')`), 'true');
    await page.call('Input.dispatchKeyEvent', { type:'keyDown', key:' ', code:'Space', windowsVirtualKeyCode:32 });
    await page.call('Input.dispatchKeyEvent', { type:'keyUp', key:' ', code:'Space', windowsVirtualKeyCode:32 });
    assert.equal(await page.evaluate(`document.querySelector('#lit-M1').getAttribute('aria-pressed')`), 'false');
    console.log(`ok liturgy selection works with Enter and Space at ${width}px`); checks++;
    const attack = '<img src=x onerror="window.matrixAttack=true">';
    await page.evaluate(`localStorage.setItem('tdh_t7_AAAABBBBCCCC', JSON.stringify({ data:{ chosen:[{domain:${JSON.stringify(attack)},title:${JSON.stringify(attack)},text:${JSON.stringify(attack)}}] } }))`);
    await page.goto('tdh/tool-7-liturgy-matrix.html?code=AAAABBBBCCCC');
    await page.waitFor(`document.querySelector('#manifesto-output').textContent.includes('onerror')`);
    assert.equal(await page.evaluate(`document.querySelectorAll('#manifesto-output img').length`), 0);
    assert.equal(await page.evaluate(`window.matrixAttack === true`), false);
    assert.equal(context.mock.research.length, 0);
    assert.deepEqual(page.errors, []);
    console.log(`ok restored matrix displays untrusted strings as text at ${width}px`); checks++;
    await context.dispose();
  }
} finally { await browser.stop(); }
console.log(`${checks} semantic browser checks passed`);
