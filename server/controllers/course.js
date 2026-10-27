const Course = require('../models/course');
const Category = require("../models/category");
const User = require("../models/user");
const Section = require("../models/section");
const subSection = require("../models/subSections");
const CourseProgress = require("../models/courseProgress");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const convertSecondsToDuration = require("../utils/convertSecondsToDuration");
require("dotenv").config();

exports.createCourse = async (req, res) => {
    try {
        // get user id from req obj
        const userId = req.user.id;

        // data fetch from req body
        let { 
            name, 
            description, 
            whatYouWillLearn, 
            price, 
            category, 
            tag: _tag, 
            instructions: _instructions,
            status 
        } = req.body;

        // file fetch from req.files or req.body
        const thumbnailFile = req.files ? req.files.thumbnailImage : null;

        // parse tag & instructions safely
        let tag = [];
        if (_tag) {
            try {
                tag = typeof _tag === 'string' ? JSON.parse(_tag) : _tag;
            } catch (e) {
                tag = typeof _tag === 'string' ? _tag.split(',').map((t) => t.trim()) : [_tag];
            }
        }

        let instructions = [];
        if (_instructions) {
            try {
                instructions = typeof _instructions === 'string' ? JSON.parse(_instructions) : _instructions;
            } catch (e) {
                instructions = typeof _instructions === 'string' ? _instructions.split(',').map((i) => i.trim()) : [_instructions];
            }
        }

        // check if required fields are present
        if (!name || !description || !whatYouWillLearn || !price || !category) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }

        // check if user is an instructor
        const instructorDetails = await User.findById(userId);
        if (!instructorDetails || instructorDetails.accountType !== 'Instructor') {
            return res.status(404).json({
                success: false,
                message: 'Instructor Details not found',
            });
        }

        const categoryDetails = await Category.findById(category);
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: 'Category Details not found',
            });
        }

        let thumbnailUrl = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80';
        if (thumbnailFile) {
            const uploadedImg = await uploadImageToCloudinary(thumbnailFile, process.env.FOLDER_NAME);
            thumbnailUrl = uploadedImg.secure_url;
        } else if (req.body.thumbnail && typeof req.body.thumbnail === 'string') {
            thumbnailUrl = req.body.thumbnail;
        }

        // create an entry for new course
        const newCourse = await Course.create({
            name,
            description,
            instructor: instructorDetails._id,
            whatYouWillLearn,
            price: Number(price),
            tag: Array.isArray(tag) && tag.length ? tag : ['Development'],
            category: categoryDetails._id,
            thumbnail: thumbnailUrl,
            studentEnrolled: [],
            status: status || 'Published',
            instructions: Array.isArray(instructions) ? instructions : [],
        });

        // add the new course to the user schema of instructor
        await User.findByIdAndUpdate(
            { _id: instructorDetails._id },
            {
                $push: {
                    courses: newCourse._id,
                }
            },
            { new: true }
        );

        // update the category schema with the new course
        const categoryDetails2 = await Category.findByIdAndUpdate(
            { _id: category },
            {
                $push: {
                    course: newCourse._id,
                }
            },
            { new: true }
        );

        console.log("Category Details 2 ->> ", categoryDetails2);
        return res.status(200).json({
            success: true,
            data: newCourse,
            message: 'Course created Successfully',
        });
    } catch (error) {
        console.error('Create course error:', error);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: 'Failed to create course',
        });
    }
};

exports.getAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find(
            { status: "Published" },
            {
                name: true,
                description: true,
                price: true,
                thumbnail: true,
                instructor: true,
                ratingAndReviews: true,
                studentEnrolled: true,
            }
        )
            .populate("instructor")
            .exec()

        return res.status(200).json({
            success: true,
            message: 'All Courses fetched Successfully!',
            data: allCourses,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch courses',
            error: error.message
        });
    }
};


exports.getCourseDetails = async (req, res) => {
    try {
        // fetch details from req body
        const { courseId } = req.body;

        // fetch course details with populated content
        const courseDetails = await Course.findOne({
            _id: courseId,
        })
            .populate({
                path: "instructor",
                populate: {
                    path: "userProfileDetails"
                }
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subsections",
                }
            })
            .exec();

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: `Course not found with id: ${courseId}`,
            });
        }

        if (courseDetails.status === "Draft") {
            return res.status(400).json({
                success: false,
                message: 'Accessing a draft course is forbidden',
            });
        }

        let totalDurationInSeconds = 0;
        courseDetails.courseContent?.forEach((content) => {
            const subs = content.subsections || content.subSection || [];
            subs.forEach((sub) => {
                const timeDurationInSeconds = parseInt(sub?.timeDuration) || 0;
                totalDurationInSeconds += timeDurationInSeconds;
            });
        });

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

        return res.status(200).json({
            success: true,
            message: 'Successfully!',
            data: {
                courseDetails,
                totalDuration,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error in getting Course Progress',
            error: error.message,
        });
    }
};


// get full course details
exports.getFullCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id;

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: 'Course ID is required',
            });
        }

        const courseDetails = await Course.findById(courseId)
            .populate({
                path: "instructor",
                populate: {
                    path: "userProfileDetails",
                }
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subsections",
                }
            })
            .exec();

        if (courseDetails.status === "Draft") {
            return res.status(400).json({
                success: false,
                message: 'Accessing a draft course is forbidden',
            });
        }

        let courseProgressCount = await CourseProgress.findOne({
            courseID: courseId,
            userId: userId,
        });
        console.log("Course Progress  Count ->> ", courseProgressCount);

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: `Could not find the course with ${courseId}`,
            });
        }

        let totalDurationInSeconds = 0;
        courseDetails.courseContent.forEach((content) => {
            content.subsections.forEach((subSection) => {
                const timeDurationInSeconds = parseInt(subSection.timeDuration);
                totalDurationInSeconds += timeDurationInSeconds;
            });
        });

        return res.status(200).json({
            success: true,
            message: 'Full course details fetched Successfully!',
            data: {
                courseDetails,
                totalDuration,
                completedVideos: courseProgressCount?.completedVideos ? courseProgressCount?.completedVideos : [],
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch full course details',
            error: error.message
        });
    }
};
// get a list of courses for a given instructor 
exports.getInstructorCourses = async (req, res) => {
    try {
        // get instructor ID from authenticated user or req body
        const instructorId = req.user.id

        // find all courses belonging to instructor
        const instructorCourses = await Course.find({
            instructor: instructorId
        })
        .populate({
            path: "courseContent",
            populate: {
                path: "subsections",
            },
        })
        .sort({ createdAt: -1 });

        // return instructors resp
        return res.status(200).json({
            success: true,
            message: 'Instructor Courses are fetched Successfully!',
            data: instructorCourses,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to retrive instructor Courses',
            error: error.message
        });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        // fetch details from req body
        const { courseId } = req.body;

        // find the course
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }

        // delete subsections for each section in the course
        const sections = await Section.find({ _id: { $in: course.courseContent } });

        for (const section of sections) {
            await subSection.deleteMany({ _id: { $in: section.subsections } });
        }

        // Delete all sections belonging to the course
        await Section.deleteMany({ _id: { $in: course.courseContent } });

        // delete the course
        await Course.findByIdAndDelete(courseId);

        return res.status(200).json({
            success: true,
            message: 'Course Deleted Successfully!',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error in deleting course',
            error: error.message
        });
    }
};