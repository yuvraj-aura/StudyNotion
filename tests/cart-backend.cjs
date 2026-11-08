const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const mongoose = require('../server/node_modules/mongoose');
let stored = [];
const User = { findByIdAndUpdate(id, pipeline, options) {
  assert.equal(options.updatePipeline, true);
  const expression = pipeline[0].$set.cart;
  if (Array.isArray(expression)) stored = expression.map(String);
  else if (expression.$setUnion) stored = [...new Set([...stored, ...expression.$setUnion[1].map(String)])];
  else stored = [...new Set(stored)].filter(id => !expression.$setDifference[1].map(String).includes(id));
  return { populate() { return this; }, async exec() { return { cart: stored }; } };
} };
const ctx = vm.createContext({ exports: {}, User, require: name => { assert.equal(name, 'mongoose'); return mongoose; } });
const source = fs.readFileSync('server/controllers/profile.js', 'utf8');
vm.runInContext(source.slice(source.indexOf('exports.syncUserCart ='), source.indexOf('// Change Password', source.indexOf('exports.syncUserCart ='))), ctx);
async function request(body) {
  let status; let result;
  await ctx.exports.syncUserCart({ user: { id: 'user' }, body }, { status(code) { status = code; return this; }, json(data) { result = data; } });
  return { status, result };
}
(async () => {
  const a = 'aaaaaaaaaaaaaaaaaaaaaaaa'; const b = 'bbbbbbbbbbbbbbbbbbbbbbbb';
  assert.equal((await request({ cartCourseIds: [a, a.toUpperCase()] })).status, 200);
  assert.equal(stored.length, 1);
  await Promise.all([request({ courseId: a, remove: false }), request({ courseId: b, remove: false })]);
  assert.deepEqual(stored, [a, b]);
  await request({ courseId: a, remove: true }); assert.deepEqual(stored, [b]);
  assert.equal((await request({ cartCourseIds: ['invalid'] })).status, 400);
  assert.equal((await request(undefined)).status, 400); assert.deepEqual(stored, [b]);
  console.log('PASS: backend deduplicates IDs, uses atomic updates and rejects malformed requests.');
})().catch(error => { console.error(error); process.exitCode = 1; });
