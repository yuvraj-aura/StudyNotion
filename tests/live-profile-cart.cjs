const fs = require('node:fs');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
require('../server/node_modules/dotenv').config({ path: 'server/.env', quiet: true });
const mongoose = require('../server/node_modules/mongoose');
const bcrypt = require('../server/node_modules/bcrypt');
const cloudinary = require('../server/node_modules/cloudinary').v2;
require('../server/config/cloudinary').cloudinaryConnect();
const User = require('../server/models/user');
const Profile = require('../server/models/profile');
const Course = require('../server/models/course');
let user, profile, publicId;
const base = 'http://localhost:' + (process.env.PORT || 4000) + '/api/v1';
async function call(path, token, body, method = 'GET') {
 const multipart = body instanceof FormData;
 const response = await fetch(base + path, { method, headers: { ...(token ? { Authorization: 'Bearer '+token } : {}), ...(!multipart && body ? {'Content-Type':'application/json'} : {}) }, body: multipart ? body : body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(95000) });
 const data = await response.json();
 if (!response.ok || !data.success) throw new Error(path + ': ' + response.status + ' ' + data.message + (data.error ? ' (' + data.error + ')' : ''));
 return data;
}
(async () => {
 try {
  await mongoose.connect(process.env.DATABASE_URL, { dbName: 'StudyNotion', serverSelectionTimeoutMS: 10000 });
  profile = await Profile.create({});
  const password = crypto.randomBytes(24).toString('hex');
  user = await User.create({firstName:'Upload',lastName:'Verification',email:'codex-upload-'+Date.now()+'@example.invalid',password:await bcrypt.hash(password,10),accountType:'Student',userProfileDetails:profile._id,image:'https://example.invalid/avatar.png'});
  const login = () => call('/auth/login',null,{email:user.email,password},'POST');
  let session = await login();
  console.log('PASS: actual API login for isolated test account');
  const form = new FormData();
  form.append('profilePhoto',new Blob([fs.readFileSync('src/assets/frame.png')],{type:'image/png'}),'verification.png');
  const started = Date.now();
  const uploaded = await call('/profile/updateProfilePhoto',session.token,form,'PUT');
  const url = uploaded.data.image;
  publicId = decodeURIComponent(url.split('/upload/')[1].replace(/^v\d+\//,'').replace(/\.[^.]+$/,''));
  assert.match(url,/^https:\/\/res\.cloudinary\.com\//);
  assert.equal((await User.findById(user._id).lean()).image,url);
  assert.equal((await call('/profile/getUserDetails',session.token)).data.image,url);
  session = await login(); assert.equal(session.data.image,url);
  console.log('PASS: real Cloudinary upload, MongoDB readback, profile reload and fresh login ('+Math.round((Date.now()-started)/1000)+' seconds)');
  const courses = await Course.find({}).select('_id').limit(2).lean();
  assert.ok(courses.length,'Need at least one existing course');
  for (const c of courses) { await call('/profile/syncUserCart',session.token,{courseId:String(c._id),remove:false},'POST'); await call('/profile/syncUserCart',session.token,{courseId:String(c._id),remove:false},'POST'); }
  const expected=courses.map(c=>String(c._id)).sort();
  assert.deepEqual((await call('/profile/getUserCart',session.token)).data.map(c=>c._id).sort(),expected);
  session=await login();
  assert.deepEqual((await call('/profile/getUserCart',session.token)).data.map(c=>c._id).sort(),expected);
  assert.deepEqual((await User.findById(user._id).lean()).cart.map(String).sort(),expected);
  await call('/profile/syncUserCart',session.token,{courseId:String(courses[0]._id),remove:true},'POST');
  assert.equal((await call('/profile/getUserCart',session.token)).data.length,courses.length-1);
  console.log('PASS: actual cart add, duplicate prevention, reload, fresh login, MongoDB equality and removal');
 } finally {
  if(publicId) { await cloudinary.uploader.destroy(publicId); console.log('Removed temporary Cloudinary image'); }
  if(user) await User.deleteOne({_id:user._id});
  if(profile) await Profile.deleteOne({_id:profile._id});
  await mongoose.disconnect();
  console.log('Removed temporary test account and profile');
 }
})().catch(error=>{console.error(error.name+': '+error.message);process.exitCode=1});
