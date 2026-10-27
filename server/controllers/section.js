const Section = require('../models/section');
const subSection = require('../models/subSections');
const Course = require('../models/course');

exports.createSection = async (req, res) => {
    try {
        // fetch files from req body
        const { sectionName, courseId } = req.body;

        // data validation
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: 'All fields are Required!',
            })
        }

        // create section
        const newSection = await Section.create({
            sectionName,
        })

        // update course with section objID
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    courseContent: newSection._id,
                },
            },
            { new: true },
        )
            .populate({
                path: "courseContent",
                populate: {
                    path: "subsections",
                }
            })
            .exec();

        // success resp
        return res.status(200).json({
            success: true,
            data: updatedCourseDetails,
            message: 'Section created Successfully!,'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to create new section. Please try again later!',
            error: error.message,
        });
    }
};

exports.updateSection = async (req, res) => {
    try {
        // fetch details from req body
        const { sectionName, sectionId, courseId } = req.body

        // data validation
        if (!sectionName || !sectionId || !courseId) {
            return res.status(400).json({
                success: false,
                message: 'All fields are Required!',
            })
        }

        // update section data
        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            {
                sectionName,
            },
            {
                new: true
            },
        );

        const course = await Course.findById(courseId)
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSections"
                }
            })
            .exec();

        // success resp
        return res.status(200).json({
            success: true,
            message: 'Section updated Successfully!',
            data: updatedSection,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to update section. Please try again later!',
            error: error.message
        });
    }
};

exports.deleteSection = async (req, res) => {
    try {
        // get ID - assuming that we are sending ID in params
        const { sectionId, courseId } = req.params;

        await Course.findByIdAndUpdate(courseId, {
            $pull: {
                courseContent: sectionId,
            }
        })

        // data validation
        if (!sectionId) {
            return res.status(400).json({
                success: false,
                message: 'All fields are Required!',
            })
        }

        const section = await Section.findById(sectionId);
        console.log(sectionId, courseId);
        if(!section){
            return res.status(404).json({
                success: false,
                message: 'Section not found',
            })
        }

        await subSection.deleteMany({
            _id: {
                $in: section.subsections
            }
        });

        // delete kardo, also in course 
        await Section.findByIdAndDelete(sectionId);

        // Todo[testing]: do we need to delete entry from course schema
        const course = await Course.findById(courseId)
        .populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            }
        })
        .exec();

        return res.status(200).json({
            success: true,
            message: 'Section deleted Successfully!',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to delete section. Please try again later!',
            error: error.message
        });
    }
};