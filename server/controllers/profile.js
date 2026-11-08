const Profile = require('../models/profile');
const User = require("../models/user");
const Course = require("../models/course");
const CourseProgress = require("../models/courseProgress");
const bcrypt = require("bcrypt");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const convertSecondsToDuration = require("../utils/convertSecondsToDuration");

exports.updateProfile = async (req, res) => {
    try {
        // fetch files from req body and get user id
        const { gender, DoB = "", about = "", phoneNum } = req.body
        const id = req.user.id;

        // data validation
        if (!phoneNum || !gender) {
            return res.status(400).json({
                success: false,
                message: 'All fields are Required!',
            });
        }
        // find profile from user detail
        const userDetails = await User.findById(id);
        const profileDetails = await Profile.findById(userDetails.userProfileDetails);

        // update profile
        profileDetails.DoB = DoB;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.phoneNum = phoneNum;
        
        await profileDetails.save();

        // success resp
        return res.status(200).json({
            success: true,
            message: 'Profile updated Successfully!',
            data: profileDetails,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to update Profile. Please try again later!',
            error: error.message
        });
    }
};


// Delete account
exports.deleteAccount = async (req, res) => {
    try {
        // get id
        const id = req.user.id;

        // id validation
        const userDetails = await User.findById({_id: id});
        if (!userDetails){
            return res.status(404).json({
                success: false,
                message: 'User not found!',
            });
        }

        // Todo: HW : unenroll user from all enrolled courses

        // How can we scheule a task (deleting acc) --> cron job

        // delete the profile first
        await Profile.findByIdAndDelete({_id: userDetails.userProfileDetails})

        // delete the user
        await User.findByIdAndDelete({_id: id});

        // success resp
        return res.status(200).json({
            success: true,
            message: 'Profile deleted Successfully!',
            // data: ,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: '',
            error: error.message
        });
    }
};


exports.getUserDetails = async (req, res) => {
    try {
        // fetch details from req body
        const id = req.user.id;

        if (!id){
            return res.status(404).json({
                success: false,
                message: 'User not found!',
            });   
        }

        const userDetails = await User.findById(id)
        .populate("userProfileDetails")
        .exec();

        return res.status(200).json({
            success: true,
            message: 'User details fetched Successfully!',
            data: userDetails,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch user details. Please try again later!',
            error: error.message
        });
    }
};



// Update profile photo
exports.updateProfilePhoto = async (req, res) => {
    try {
        // get user id from auth middleware
        const id = req.user.id;

        // check if a file was uploaded
        const profilePhoto = req.files?.profilePhoto;
        if (!profilePhoto) {
            return res.status(400).json({
                success: false,
                message: "No image file provided. Please upload a profile photo.",
            });
        }

        // validate file type
        const supportedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!supportedTypes.includes(profilePhoto.mimetype)) {
            return res.status(400).json({
                success: false,
                message: "Unsupported file type. Please upload a JPEG, PNG, or WebP image.",
            });
        }

        // validate file size (max 5 MB)
        const maxSize = 5 * 1024 * 1024;
        if (profilePhoto.size > maxSize) {
            return res.status(400).json({
                success: false,
                message: "File too large. Maximum allowed size is 5 MB.",
            });
        }

        // upload image to Cloudinary (resized to 300px, quality 80)
        const uploadResult = await uploadImageToCloudinary(
            profilePhoto,
            process.env.FOLDER_NAME || "profile_photos",
            300,
            80,
            { timeout: 60000, resource_type: "image" }
        );

        // update the user's image field in DB
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { image: uploadResult.secure_url },
            { new: true }
        ).populate("userProfileDetails").exec();

        return res.status(200).json({
            success: true,
            message: "Profile photo updated successfully!",
            data: updatedUser,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update profile photo. Please try again later.",
            error: error.message,
        });
    }
};


// Get Enrolled Courses for a user
exports.getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id;

        const userDetails = await User.findById(userId)
            .populate({
                path: "courses",
                populate: {
                    path: "courseContent",
                    populate: {
                        path: "subsections",
                    },
                },
            })
            .exec();

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: `Could not find user with id: ${userId}`,
            });
        }

        const coursesWithProgress = [];

        for (const course of userDetails.courses) {
            let totalDurationInSeconds = 0;
            let subSectionLength = 0;

            for (const section of course.courseContent) {
                for (const subSection of section.subsections || []) {
                    totalDurationInSeconds += parseInt(subSection.timeDuration) || 0;
                    subSectionLength += 1;
                }
            }

            let progressPercentage = 0;
            if (subSectionLength > 0) {
                const courseProgressCount = await CourseProgress.findOne({
                    courseId: course._id,
                    userId: userId,
                });
                const completedCount = courseProgressCount?.completedVideos?.length || 0;
                progressPercentage = Math.round((completedCount / subSectionLength) * 100);
            } else {
                progressPercentage = 100;
            }

            coursesWithProgress.push({
                ...course.toObject(),
                totalDuration: convertSecondsToDuration(totalDurationInSeconds),
                totalNoOfLectures: subSectionLength,
                progressPercentage,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Enrolled courses fetched successfully!",
            data: coursesWithProgress,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch enrolled courses",
        });
    }
};

// Get Cart items for a user
exports.getUserCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate("cart").exec();
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({
            success: true,
            data: user.cart || [],
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch cart from database",
            error: error.message,
        });
    }
};

// Sync / Update Cart items in database for a user
exports.syncUserCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { cartCourseIds, courseId, remove } = req.body || {};
        const validId = (id) => typeof id === "string" && /^[a-f0-9]{24}$/i.test(id);
        const singleCourse = courseId !== undefined;
        if (singleCourse ? !validId(courseId) || typeof remove !== "boolean"
            : !Array.isArray(cartCourseIds) || !cartCourseIds.every(validId)) {
            return res.status(400).json({ success: false, message: "Provide valid cart course IDs" });
        }
        // Atomic set operations prevent duplicate additions and lost updates across tabs.
        const ids = singleCourse ? [courseId] : cartCourseIds;
        const objectIds = [...new Set(ids.map((id) => id.toLowerCase()))]
            .map((id) => new (require("mongoose").Types.ObjectId)(id));
        const currentCart = { $ifNull: ["$cart", []] };
        const nextCart = singleCourse
            ? remove ? { $setDifference: [currentCart, objectIds] } : { $setUnion: [currentCart, objectIds] }
            : objectIds;
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            [{ $set: { cart: nextCart } }],
            { new: true, updatePipeline: true }
        ).populate("cart").exec();
        if (!updatedUser) return res.status(404).json({ success: false, message: "User not found" });

        return res.status(200).json({
            success: true,
            message: "Cart synced with database successfully",
            data: updatedUser.cart,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to sync cart in database",
            error: error.message,
        });
    }
};

// Change Password
exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Old password and new password are required.",
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Old password is incorrect.",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to change password.",
            error: error.message,
        });
    }
};

// Delete Profile (soft delete)
exports.deleteProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        user.isDeleted = true;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete profile.",
            error: error.message,
        });
    }
};


exports.instructorDashboard = async (req, res) => {
    try {
        const courseDetails = await Course.find({instructor: req.user.id});

        const courseData = courseDetails.map((course) => {
            const totalStudentsEnrolled = course.studentEnrolled.length
            const totalAmountGenerated = totalStudentsEnrolled * course.price

            // create a new obj with the additional features
            const courseDataWithStats = {
                _id: course._id,
                courseName: course.name,
                courseDesc: course.description,
                totalStudentsEnrolled,
                totalAmountGenerated,
            }

            return courseDataWithStats
        })

        return res.status(200).json({
            success: true,
            message: 'Instructor Details fetched Successfully!',
            courses: courseData,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: '',
            error: err.message
        });
    }
};