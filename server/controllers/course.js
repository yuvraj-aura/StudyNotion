const Course = require('../models/course');
const Category = require("../models/category");
const User = require("../models/user");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createCourse = async (req, res) => {
    try {
        // date fetch karenge from req body
        const { name, description, whatYouWillLearn, price, category, tag } = req.body;

        // file fetch krenge from req.file
        const thumbnail = req.files.thumbnailImage;

        // validation
        if (!name || !description || !whatYouWillLearn || !price || !category) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required!',
            })
        }

        // check for instructions
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("Instructor Details ->> ", instructorDetails);
        // TODO: check user id and instructorDetails._id are same or different?

        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: 'Instructor Details not found!',
            })
        }

        // check category is valid or not
        const categoryDetails = await Category.findById(category);
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: 'Category details not found!',
            })
        }

        // upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME)

        // create an entry for new course
        const newCourse = await Course.create({
            name, description,
            instructor: instructorDetails._id,
            whatYouWillLearn,
            price,
            tag,
            category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
            studentEnrolled: [],
        })

        // add the new course to the user schema of instructor
        await User.findByIdAndUpdate(
            { _id: instructorDetails._id },
            {
                $push: {
                    courses: newCourse._id,
                }
            },
            { new: true },
        );

        // update the category schema with the new course
        await Category.findByIdAndUpdate(
            { _id: categoryDetails._id },
            {
                $push: {
                    course: newCourse._id,
                }
            },
            { new: true },
        );
        return res.status(200).json({
            success: true,
            data: newCourse,
            message: 'Course created Successfully,'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.showAllCourses = async (req, res) => {
    try {
        // TODO: change the below statement incrementally

        const allCourses = await Course.find({}, {
            name: true,
            description: true,
            thumbnail: true,
            price: true,
            instructor: true,
            ratingAndReviews: true,
            studentEnrolled: true,
        }).populate("instructor").exec();

        return res.status(200).json({
            success: true,
            message: 'All courses fetched Successfully',
            data: allCourses,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: 'Unable to fetch all courses',
        });
    }
};

exports.getCourseDetails = async (req, res) => {
    try {
        // fetch details from req body
        const { courseId } = req.body;

        // populate other details of course

        const courseDetails = await Course.findOne(
            { _id: courseId },
        )
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
            }).exec();


       // validation
       if (!courseDetails) {
           return res.status(400).json({
               success: false,
               message: `Could not find the course with ${courseId}`,
           })
       } 
        return res.status(200).json({
            success: true,
            message: 'Course details fetched Successfully!',
            data: courseDetails,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch course details',
            error: error.message,
        });
    }
};