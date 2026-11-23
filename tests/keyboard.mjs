// Keyboard contract for the TDH privacy dialog and the temporary Music page.
import assert from 'node:assert/strict';
import { CHROME, launch } from './lib/browser.mjs';

if (!CHROME) {
  console.log('keyboard test skipped: Chrome not found');
  process.exit(0);
}

async function press(page, key, modifiers = 0) {
  const codes = { Enter: 13, Escape: 27, Tab: 9 };
  const event = { key, code: key, windowsVirtualKeyCode: codes[key], modifiers };
  await page.call('Input.dispatchKeyEvent', {
    type: 'keyDown', ...event, ...(key === 'Enter' ? { text: '\r' } : {}),
  });
  await page.call('Input.dispatchKeyEvent', { type: 'keyUp', ...event });
}

const privacyPages = [
  'tool-1-trigger-gradient', 'tool-2-aspirational-self', 'tool-3-attachment-confirmation',
  'tool-4-dark-night', 'tool-5-protocol-designer', 'tool-6-threshold', 'tool-7-liturgy-matrix',
  'profile',
];
const settings = '.tdh-privacy-settings';
const panel = '.tdh-privacy-backdrop';
const focusables = `[...document.querySelector(${JSON.stringify(panel)})
  .querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), summary')]
  .filter(control => control.getClientRects().length > 0)`;

const browser = await launch();
try {
  for (const name of privacyPages) {
    const context = await browser.context({ webdriver: true });
    try {
      const page = await context.page(`tdh/${name}.html`);
      await page.waitFor(`!!document.querySelector('${settings}')`);
      await page.evaluate(`document.querySelector('${settings}').focus()`);
      await press(page, 'Enter');
      await page.waitFor(`!!document.querySelector('${panel}')`);
      assert.equal(await page.evaluate("document.activeElement.id"), 'tdh-age-check');
      if (await page.evaluate("!!document.querySelector('.tdh-terms')")) {
        await page.evaluate("document.querySelector('.tdh-terms summary').focus()");
        await press(page, 'Enter');
        assert.equal(await page.evaluate("document.querySelector('.tdh-terms').open"), true);
        await press(page, 'Enter');
        assert.equal(await page.evaluate("document.querySelector('.tdh-terms').open"), false);
      }
      await page.evaluate(`${focusables}[0].focus()`);
      await press(page, 'Tab', 8);
      assert.equal(await page.evaluate(`document.activeElement === ${focusables}.at(-1)`), true, `${name}: Shift+Tab wraps to the last control`);
      await press(page, 'Tab');
      assert.equal(await page.evaluate(`document.activeElement === ${focusables}[0]`), true, `${name}: Tab wraps to the first control`);
      await press(page, 'Escape');
      assert.equal(await page.evaluate(`!document.querySelector('${panel}') && document.activeElement.matches('${settings}')`), true, `${name}: Escape closes and restores focus`);
      assert.deepEqual(page.errors, []);
      console.log(`ok ${name}: Data choices opens, traps focus and restores it on Escape`);
    } finally {
      await context.dispose();
    }
  }

  const context = await browser.context({ webdriver: true });
  try {
    const page = await context.page('lyrics.html');
    await page.waitFor("!!document.querySelector('.music-contact')");
    assert.equal(await page.text('main h1'), 'Music');
    assert.equal(await page.text('.music-status'), 'Temporarily under construction');
    assert.equal(await page.evaluate("document.querySelectorAll('audio, .track-toggle, .track-index').length"), 0);
    await page.evaluate("document.querySelector('.music-contact').focus()");
    await press(page, 'Enter');
    await page.waitFor("location.pathname === '/contact.html'");
    assert.deepEqual(page.errors, []);
    console.log('ok Music inquiry link opens with Enter');
  } finally {
    await context.dispose();
  }
} finally {
  await browser.stop();
}
