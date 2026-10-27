const subSection = require('../models/subSections');
const Section = require("../models/section");
const {uploadImageToCloudinary} = require("../utils/imageUploader")
require("dotenv").config();

exports.createSubSection = async (req, res) => {
    try {
        const { title, timeDuration, description, sectionId, videoURL } = req.body;
        const videoFile = req.files ? (req.files.video || req.files.videoFile) : null;

        if (!sectionId || !title) {
            return res.status(400).json({
                success: false,
                message: 'Section ID and Lecture Title are required',
            });
        }

        let finalVideoUrl = videoURL || 'https://res.cloudinary.com/demo/video/upload/sample.mp4';
        let calculatedDuration = timeDuration || '15m';

        if (videoFile) {
            const uploadDetails = await uploadImageToCloudinary(videoFile, process.env.FOLDER_NAME);
            finalVideoUrl = uploadDetails.secure_url;
            if (uploadDetails.duration) {
                calculatedDuration = `${Math.round(uploadDetails.duration)}s`;
            }
        }

        const subSectionDetails = await subSection.create({
            title: title,
            timeDuration: timeDuration || calculatedDuration,
            description: description || '',
            videoURL: finalVideoUrl,
        });

        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            {
                $push: {
                    subsections: subSectionDetails._id,
                },
            },
            { new: true }
        ).populate('subsections');

        return res.status(200).json({
            success: true,
            message: 'Lecture created successfully!',
            data: updatedSection,
        });
    } catch (error) {
        console.error('Error creating lecture:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create lecture. Please try again.',
            error: error.message,
        });
    }
};

exports.updateSubSection = async (req, res) => {
    try {
        // fetch details from req body
        const { sectionId, subSectionId, title, timeDuration, description } = req.body;

        // data validation
        if (!subSectionId || !title || !timeDuration || !description) {
            return res.status(400).json({
                success: false,
                message: 'All fields are Required!',
            });
        }

        // find the sub section
        const subSectionInstance = await subSection.findById(subSectionId);

        if (!subSectionInstance) {
            return res.status(404).json({
                success: false,
                message: 'SubSection not found',
            });
        }

        // handle video upload if a new video file is provided
        if (req.files && req.files.video) {
            const video = req.files.video;
            const uploadDetails = await uploadImageToCloudinary(
                video,
                process.env.FOLDER_NAME,
            );
            subSectionInstance.videoURL = uploadDetails.secure_url;
            // derive duration from uploaded video if available
            if (uploadDetails.duration) {
                subSectionInstance.timeDuration = String(uploadDetails.duration);
            }
        }

        // update text fields
        subSectionInstance.title = title;
        subSectionInstance.description = description;
        subSectionInstance.timeDuration = timeDuration;

        await subSectionInstance.save();

        const updatedSubSection = await subSection.findById(subSectionId);

        // success resp send karo
        return res.status(200).json({
            success: true,
            message: 'Subsection updated successfully!',
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
        const { subSectionId, sectionId } = req.body;

        if (!subSectionId) {
            return res.status(400).json({
                success: false,
                message: 'subSectionId is required',
            });
        }

        const subSectionInstance = await subSection.findById(subSectionId);
        if (!subSectionInstance) {
            return res.status(404).json({
                success: false,
                message: 'SubSection not found',
            });
        }

        // remove the subsection reference from its parent section
        if (sectionId) {
            await Section.findByIdAndUpdate(
                { _id: sectionId },
                {
                    $pull: {
                        subsections: subSectionId,
                    }
                }
            );
        }

        // delete the subsection document
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