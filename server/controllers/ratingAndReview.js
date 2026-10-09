const RatingAndReviews = require('../models/ratingAndReviews');
const Course = require("../models/course");

exports.createRating = async (req, res) => {
    try {
        // fetch files from req body
        const { rating, review, courseId } = req.body

        // get usr id
        const userId = req.user.id;

        // check if user enrolled or not
        const courseDetails = await Course.findOne(
            {
                _id: courseId,
                studentEnrolled: {
                    $elemMatch: {
                        $eq: userId,
                    }
                }
            },
        )

        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: `Student is not enrolled in this course`,
            })
        }

        // check if user already reviewed the course
        const alreadyReviewed = await RatingAndReviews.findOne({
            user: userId,
            course: courseId,
        });
        if (alreadyReviewed) {
            return res.status(400).json({
                success: false,
                message: `Course is already reviewed by the user`,
            })
        }

        // creating rating 
        const ratingAndReview = await RatingAndReviews.create({
            rating,
            review,
            course: courseId,
            user: userId,
        })


        // update the course with this rating
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            { _id: courseId },
            {
                $push: {
                    ratingAndReviews: ratingAndReview._id,
                }
            },
            { new: true },
        );
        console.log(updatedCourseDetails);

        // return resp
        return res.status(200).json({
            success: true,
            message: 'Rating and reviewed Successfully',
            data: ratingAndReview,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to create rating and review',
            error: error.message
        });
    }
};

exports.getAvgRatings = async (req, res) => {
    try {
        // fetch courseId from req body
        const { courseId } = req.body;

        // If the client sends an invalid ID like "courseId": "hello"
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid course ID",
            });
        }


        // calculate avg raitng
        const result = await RatingAndReviews.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId),
                }
            },
            {
                $group: {
                    _id: null,
                    averageRating: {
                        $avg: "$rating"
                    },
                }
            }
        ])

        if (result.length > 0) {
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            });
        }

        // return resp if no rating exists
        return res.status(200).json({
            success: true,
            message: 'Average Rating is 0, no ratings given till now',
            averageRating: 0,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: '',
            error: error.message
        });
    }
};

exports.getAllRatingAndReview = async (req, res) => {
    try {
        // fetch details from req body
        const allReviews = await RatingAndReviews.find({})
            .sort({ rating: "desc" })
            .populate({
                path: "user",
                select: "firstName lastName enail image",
            })
            .populate({
                path: "course",
                select: "name",
            })

        return res.status(200).json({
            success: true,
            message: 'All ratings and reveiws fetched Successfully!',
            data: allReviews,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch ratings and reviews',
            error: error.message
        });
    }
};

// course id kecorresponding rating and review