const subSection = require('../models/subSections');
const Section = require("../models/section");
const {uploadImageToCloudinary} = require("../utils/imageUploader")
require("dotenv").config();

exports.createSubSection = async (req, res) => {
    try {
        // fetch files from req body
        const { title, timeDuration, description, sectionId } = req.body

        // extract file/video
        const video = req.files.videoFile;

        // validation
        if (!title || !timeDuration || !description || !sectionId) {
            return res.status(400).json({
                success: false,
                message: 'All fields are Required!',
            });
        }

        // upload video to cloudinary to get secure url
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

        // create a sub section
        const subSectionDetails = await subSection.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            videoURL: uploadDetails.secure_url,
        })

        // update section with this sub section obj id
        const updatedSection = await Section.findByIdAndUpdate(
            {_id: sectionId},
            {
                $push: {
                    subsections: subSectionDetails._id,
                },
            },
            {
                new: true,
            },
        );
        // TODO: log updated section here, after adding populate query

        // success resp
        return res.status(200).json({
            success: true,
            message: 'Sub Section created Successfully!',
            data: updatedSection,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to create sub Section. Please try again later!',
            error: error.message
        });
    }
};

// Update subsection
exports.updateSubSection = async (req, res) => {
    try {
        // fetch details from req body
        const {subSectionId, title, timeDuration, description} = req.body

        // data validation
        if (!subSectionId || !title || !timeDuration || !description) {
            return res.status(400).json({
                success: false,
                message: 'All fields are Required!',
            });
        }

        // update karo sub section ko
        const updatedSubSection = await subSection.findByIdAndUpdate(
            subSectionId,
            {
                title: title,
                description: description,
                timeDuration: timeDuration,
            },
            {new: true},
        )

        // success resp send karo
        return res.status(200).json({
            success: true,
            message: 'Successfully!',
            data: updatedSubSection,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to update sub Section. Please try again later!',
            error: error.message
        });
    }
};

// delete subsection
exports.deleteSubSection = async (req, res) => {
    try {
        // fetch details from req body
        const {subSectionId} = req.body

        // data validation
        if (!subSectionId) {
            return res.status(400).json({
                success: false,
                message: 'All fields are Required!',
            });
        }

        await subSection.findByIdAndDelete(subSectionId);

        return res.status(200).json({
            success: true,
            message: 'Sub Section deleted Successfully!',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to delete sub section. Please try again later!',
            error: error.message
        });
    }
};