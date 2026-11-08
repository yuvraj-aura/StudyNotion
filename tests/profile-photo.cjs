const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const events = []; const storage = new Map(); let fail;
const ctx = vm.createContext({
  toast: { loading: () => 'upload', success: (message, options) => events.push(['success', options.id]), error: (message, options) => events.push(['error', options.id]) },
  settingsEndpoints: {}, setUser: user => ({ type: 'user', payload: user }),
  localStorage: { setItem: (key, value) => storage.set(key, value) }, console: { log() {}, error() {} },
  apiConnector: async (...args) => {
    assert.equal(args[5].timeout, 90000);
    assert.equal(args[3]['Content-Type'], undefined);
    if (fail) throw fail;
    return { data: { success: true, data: { image: 'https://example.test/photo.png' } } };
  }
});
const source = fs.readFileSync('src/services/operations/settingsAPI.js', 'utf8').replace(/^import .*;\r?\n/gm, '').replaceAll('export ', '');
vm.runInContext(source + '\nglobalThis.upload = updateProfilePicture;', ctx);
(async () => {
  const actions = [];
  assert.ok(await ctx.upload('token', {})(action => actions.push(action)));
  assert.equal(actions.length, 1); assert.ok(storage.get('user'));
  for (const error of [Error('provider failed'), Object.assign(Error('timeout'), { code: 'ECONNABORTED' })]) {
    fail = error; assert.equal(await ctx.upload('token', {})(action => actions.push(action)), null);
  }
  assert.deepEqual(events, [['success', 'upload'], ['error', 'upload'], ['error', 'upload']]);
  assert.equal(actions.length, 1);
  console.log('PASS: upload success, failure and timeout settle the loading toast; only success updates user storage.');
})().catch(error => { console.error(error); process.exitCode = 1; });
