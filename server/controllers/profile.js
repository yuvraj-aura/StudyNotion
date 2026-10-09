const Profile = require('../models/profile');
const User = require("../models/user");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

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

        const userDetails = await User.findById(id).populate("userProfileDetails").exec();

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
            80
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

        return res.status(200).json({
            success: true,
            message: "Enrolled courses fetched successfully!",
            data: userDetails.courses,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch enrolled courses",
            error: error.message,
        });
    }
};