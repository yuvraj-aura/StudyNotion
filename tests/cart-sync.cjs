const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const { createSlice } = require('@reduxjs/toolkit');
const storage = new Map();
const ctx = vm.createContext({ createSlice, localStorage: {
  getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key)
}, toast: { success() {}, error() {} }, profileEndpoints: {}, console });
const read = path => fs.readFileSync(path, 'utf8').replace(/^import .*;\r?\n/gm, '').replaceAll('export ', '');
vm.runInContext(read('src/redux/slices/cartSlice.js').replace('default cartSlice.reducer;', 'globalThis.reducer = cartSlice.reducer;'), ctx);
vm.runInContext(read('src/services/operations/cartAPI.js') + '\nglobalThis.load = getUserCartFromDB; globalThis.update = updateCourseInCart;', ctx);
let state = { auth: { token: 'user-a' }, cart: ctx.reducer(undefined, { type: 'init' }) };
const dispatch = action => typeof action === 'function' ? action(dispatch, () => state) : (state.cart = ctx.reducer(state.cart, action));
const course = { _id: 'aaaaaaaaaaaaaaaaaaaaaaaa', price: 100 };
let saved = [course];
ctx.apiConnector = async (method, url, body) => {
  if (method === 'POST') saved = body.remove ? [] : [course];
  return { data: { success: true, data: saved } };
};
(async () => {
  await dispatch(ctx.load('user-a'));
  assert.equal(state.cart.cartReady, true);
  assert.equal(state.cart.cart[0]._id, course._id);
  await dispatch(ctx.update(course)); await dispatch(ctx.update(course));
  assert.equal(state.cart.totalItems, 1);
  assert.equal(JSON.parse(storage.get('cart')).length, 1);
  state.cart = ctx.reducer(undefined, { type: 'init' });
  await dispatch(ctx.load('user-a'));
  assert.equal(state.cart.cart[0]._id, course._id, 'refresh restores saved course');
  dispatch({ type: 'cart/resetCart' }); state.auth.token = 'user-a-new-login';
  await dispatch(ctx.load('user-a-new-login'));
  assert.equal(state.cart.totalItems, 1, 'login restores database cart');
  saved = [course, course]; await dispatch(ctx.load('user-a-new-login'));
  assert.equal(state.cart.totalItems, 1, 'duplicate server entries are normalized');
  let resolve; ctx.apiConnector = () => new Promise(done => { resolve = done; });
  const pending = dispatch(ctx.load('user-a-new-login'));
  dispatch({ type: 'cart/resetCart' }); state.auth.token = 'user-b';
  resolve({ data: { success: true, data: [course] } }); await pending;
  assert.equal(state.cart.totalItems, 0, 'old account response ignored');
  ctx.apiConnector = async () => { throw Error('offline'); };
  await dispatch(ctx.load('user-b'));
  assert.equal(state.cart.cartReady, false); assert.equal(state.cart.cartLoading, false);
  console.log('PASS: refresh, relogin, duplicate normalization, local storage, stale account responses and load failure.');
})().catch(error => { console.error(error); process.exitCode = 1; });
