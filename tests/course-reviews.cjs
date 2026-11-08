const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const mongoose = require('../server/node_modules/mongoose');
const Review = require('../server/models/ratingAndReviews');

const userId = new mongoose.Types.ObjectId().toString();
const courseId = new mongoose.Types.ObjectId().toString();
const otherCourseId = new mongoose.Types.ObjectId().toString();
const stored = [];
const links = new Map([[courseId, []], [otherCourseId, []]]);
let enrolled = true;
let missingOnUpdate = false;
const same = (a, b) => String(a) === String(b);
const reviews = {
  async findOne(query) {
    return stored.find(item => same(item.user, query.user) && query.$or.some(condition =>
      condition.course ? same(item.course, condition.course) : condition._id.$in.some(id => same(id, item._id))
    ));
  },
  async create(data) {
    const doc = new Review(data);
    await doc.validate();
    const value = doc.toObject();
    stored.push(value);
    return { ...value, async populate(path, fields) {
      assert.equal(path, 'user');
      assert.equal(fields, 'firstName lastName image');
      this.user = { _id: userId, firstName: 'Enrolled', lastName: 'Student' };
    } };
  },
  async findByIdAndDelete(id) {
    stored.splice(stored.findIndex(item => same(item._id, id)), 1);
  },
};
const courses = {
  async findOne(query) {
    assert.equal(query.studentEnrolled.$elemMatch.$eq, userId);
    return enrolled ? { ratingAndReviews: links.get(query._id) } : null;
  },
  async findByIdAndUpdate(query, update) {
    if (missingOnUpdate) return null;
    links.get(query._id).push(update.$addToSet.ratingAndReviews);
    return { _id: query._id };
  },
};
const context = vm.createContext({ exports: {}, require(name) {
  if (name === 'mongoose') return mongoose;
  if (name === '../models/course') return courses;
  if (name === '../models/ratingAndReviews') return reviews;
  throw new Error('Unexpected import ' + name);
} });
vm.runInContext(fs.readFileSync('server/controllers/ratingAndReview.js', 'utf8'), context);
async function submit(body) {
  let status, result;
  await context.exports.createRating({ user: { id: userId }, body }, {
    status(value) { status = value; return this; },
    json(value) { result = value; },
  });
  return { status, result };
}

(async () => {
  const body = { courseId, rating: 5, review: '  Useful course  ', user: 'spoofed-author' };
  enrolled = false;
  assert.equal((await submit(body)).status, 400);
  assert.equal(stored.length, 0);
  enrolled = true;
  for (const invalid of [undefined, { ...body, courseId: 'bad' }, { ...body, rating: 0 },
    { ...body, rating: 6 }, { ...body, rating: '5' }, { ...body, review: '  ' }]) {
    assert.equal((await submit(invalid)).status, 400);
  }
  const saved = await submit(body);
  assert.equal(saved.status, 200);
  assert.equal(String(stored[0].course), courseId);
  assert.equal(String(stored[0].user), userId);
  assert.equal(stored[0].review, 'Useful course');
  assert.equal(saved.result.data.user.firstName, 'Enrolled');
  assert.equal(String(links.get(courseId)[0]), String(stored[0]._id));
  assert.equal((await submit(body)).status, 400);
  assert.equal((await submit({ ...body, courseId: otherCourseId })).status, 200);
  // Existing reviews without a course field remain protected through course references.
  delete stored[0].course;
  assert.equal((await submit(body)).status, 400);
  stored.splice(1, 1);
  links.set(otherCourseId, []);
  missingOnUpdate = true;
  assert.equal((await submit({ ...body, courseId: otherCourseId })).status, 404);
  assert.equal(stored.length, 1);
  console.log('PASS: real schema retains course and purchaser; controller validates enrollment, input, author identity, course links, names, per-course duplicates, legacy reviews, and deleted-course cleanup.');
})().catch(error => { console.error(error); process.exitCode = 1; });
