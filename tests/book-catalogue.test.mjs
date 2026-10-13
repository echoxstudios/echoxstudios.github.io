import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const code = fs.readFileSync(new URL('../tdh/book-catalogue.js', import.meta.url), 'utf8');
const ctx = vm.createContext({});
vm.runInContext(code, ctx);
const catalogue = ctx.TDH_BOOK;
assert.equal(catalogue.releaseEdition, 'v142');
console.log('ok book catalogue defaults to the released edition');
assert.equal(catalogue.get('dark-night', 'v124').printedPage, '227');
assert.equal(catalogue.get('dark-night', 'v135').printedPage, '234');
assert.equal(catalogue.get('dark-night').edition, 'v142', 'the default destination is the released edition');
const routeIds = Object.keys(JSON.parse(code.slice(code.indexOf('{', code.indexOf('const data')), code.indexOf('};', code.indexOf('const data')) + 1)).routes);
assert.equal(routeIds.length, 32, 'all 32 reading destinations are present');
for (const id of routeIds) {
  for (const edition of ['v124', 'v135', 'v141', 'v142']) assert.ok(catalogue.get(id, edition).physicalPage > 10, `${id} @ ${edition}`);
  assert.ok(Number(catalogue.get(id, 'v142').printedPage) <= 308, `${id} lies within the v142 reading text`);
}
console.log(`ok all ${routeIds.length} destinations resolve in both editions`);
assert.ok(catalogue.get('practice.drift', 'v124').physicalPage > 10);
assert.equal(catalogue.get('expressions.visual').label, 'Book II, Section III — Visual');
console.log('ok book catalogue has edition-aware, checked destinations');
assert.throws(()=>catalogue.get('nonexistent-coda'));
assert.throws(()=>catalogue.get('attachment','v999'));
assert.throws(()=>catalogue.get('dark-night','v125'), /Unknown book route or edition/);
console.log('ok unknown book routes and editions fail explicitly');
for (const file of ['tool-1-trigger-gradient.html','tool-4-dark-night.html']) {
  const html = fs.readFileSync(new URL('../tdh/' + file, import.meta.url), 'utf8');
  const ids = [...html.matchAll(/(?:route:|TDH_BOOK\.reference\()'([^']+)'/g)].map(m=>m[1]);
  assert.ok(ids.length >= 8);
  for (const id of ids) {
    assert.ok(catalogue.get(id,'v124').physicalPage > 10);
    assert.ok(catalogue.get(id,'v135').physicalPage > 10);
  }
  assert.ok(html.indexOf('src="book-catalogue.js') < html.indexOf('const QUESTIONS'));
  assert.doesNotMatch(html, /ref:'Book|section:'Book|On Structural Drift|On the Drift That Starves/);
  console.log(`ok ${file}: every recommendation uses the shared catalogue`);
}
