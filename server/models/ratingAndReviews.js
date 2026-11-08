const mongoose = require('mongoose');

const ratingAndReviewsSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Course",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
    trim: true,
    required: true,
  }
});

module.exports = mongoose.model('RatingAndReviews', ratingAndReviewsSchema);
