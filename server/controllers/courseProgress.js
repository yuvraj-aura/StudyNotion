const courseProgress = require("../models/courseProgress");
const subSection = require("../models/subSections");

exports.updateCourseProgress = async (req, res) => {
    try {
        // fetch details from req body
        const {courseId, subSectionId} = req.body
        const userId = req.user.id;

        try{
            // check if the subsection is valid
            const subSection = await subSection.findById(subSectionId)

            if (!subSection){
                return res.status(404).json({
                    success: false,
                    message: 'Invalid SubSection',
                });
            }

            // check for old entry
            let courseProgress = await courseProgress.findOne({
                courseId: courseId,
                userId: userId,
            })
            if (!courseProgress){
                return res.status(404).json({
                    success: false,
                    message: 'Course Progress does not exists',
                });
            }
            else{
                // check for re-completed video/subSection
                if (courseProgress.completedVideos.includes(subSectionId)){
                    return res.status(400).json({
                        success: false,
                        message: 'Subsection already completed',
                    });
                }

                // if not present, push into completed videos
                courseProgress.completedVideos.push(subSectionId)
            }
            await courseProgress.save();

        }catch(err){
            console.error(err)
            return res.status(500).json({
                success: false,
                message: 'Internal Server error',
                error: err.message
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Course Progress updated Successfully!',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to update the course progress. Try again later!',
            error: error.message
        });
    }
};