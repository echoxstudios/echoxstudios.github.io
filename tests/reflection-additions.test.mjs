// The optional additions drawn from the book's v133 material (not scored, not saved, not sent):
// tool 2 and tool 3 reflection questions, and tool 5's renewal protocol for partnered dynamics.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const read = f => fs.readFileSync(new URL('../tdh/' + f, import.meta.url), 'utf8');
let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log('ok  ' + name); };

for (const [file, id, question] of [
  ['tool-2-aspirational-self.html', 'fr2-note', /In whose presence do you move toward this self/],
  ['tool-3-attachment-confirmation.html', 'fr3-note', /Where is your absence noticed\?/],
]) {
  const src = read(file);
  const scripts = [...src.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]).join('\n');
  test(`${file}: the reflection question is present, labelled and declared unsaved`, () => {
    assert.match(src, question);
    assert.match(src, new RegExp(`<label id="${id.replace('-note', '-label')}" for="${id}"`));
    assert.match(src, /not part of your result, your code, your e-mail or the research counters/);
    assert.match(src, /further-reflection\.css/);
  });
  test(`${file}: no script reads the reflection note, so it cannot be saved, e-mailed or counted`, () => {
    assert.doesNotMatch(scripts, new RegExp(id));
  });
}

test('tool-3: the mattering question carries a care line', () => {
  assert.match(read('tool-3-attachment-confirmation.html'), /local crisis line/);
});

test('tool-5: renewal is offered to partnered dynamics and withheld from solo practice', () => {
  const src = read('tool-5-protocol-designer.html');
  const grab = (start) => {
    const i = src.indexOf(start); assert.ok(i >= 0, start);
    let depth = 0, k = src.indexOf('{', i);
    for (let j = k; j < src.length; j++) { if (src[j] === '{') depth++; else if (src[j] === '}' && !--depth) return src.slice(i, j + 1); }
  };
  const code = ['const DAILY_LIBRARY = [', 'const WEEKLY_LIBRARY = [', 'const RENEWAL = {'].map(m => {
    const i = src.indexOf(m); const end = src.indexOf('\n];', i) >= 0 && m.endsWith('[') ? src.indexOf('\n];', i) + 3 : src.indexOf('\n};', i) + 3; return src.slice(i, end);
  }).join('\n') + '\n' + ['function scoreRitual(', 'function filterDailyRituals(', 'function filterWeeklyStructures(', 'function escalationText(', 'function esc(', 'function ritualHTML(', 'function weeklyHTML(', 'function buildProtocolDoc('].map(grab).join('\n');
  const run = answers => { const ctx = vm.createContext({ answers, getPrimaryChannel: () => 'intellectual' }); vm.runInContext(code + '\nglobalThis.out = buildProtocolDoc();', ctx); return ctx.out; };
  const partnered = run({ B1: 'coloc', C1: 'dom', C2: 'established', D2: 'never' });
  const solo = run({ B1: 'solo', C1: 'dom', C2: 'imagined', D2: 'never' });
  assert.match(partnered, /A Shared New Room/);
  assert.match(partnered, /either of you may decline/);
  assert.doesNotMatch(solo, /A Shared New Room/);
});

console.log(`${passed} reflection-addition checks passed`);
