const Course = require("../models/course");
const CourseProgress = require("../models/courseProgress");
const mongoose = require("mongoose");

exports.updateCourseProgress = async (req, res) => {
    const { courseId, subSectionId } = req.body ?? {};
    const userId = req.user.id;

    if (!mongoose.isObjectIdOrHexString(courseId) || !mongoose.isObjectIdOrHexString(subSectionId)) {
        return res.status(400).json({ success: false, message: "Invalid course or lecture ID" });
    }

    try {
        const course = await Course.findOne({ _id: courseId, studentEnrolled: userId })
            .select("courseContent")
            .populate({ path: "courseContent", select: "subsections" });
        if (!course) return res.status(403).json({ success: false, message: "Course access denied" });

        const containsLecture = course.courseContent.some(
            (section) => section.subsections.some((id) => String(id) === subSectionId),
        );
        if (!containsLecture) {
            return res.status(404).json({ success: false, message: "Lecture does not belong to this course" });
        }

        const result = await CourseProgress.updateOne(
            { courseId, userId },
            { $addToSet: { completedVideos: subSectionId } },
        );
        if (!result.matchedCount) {
            return res.status(404).json({ success: false, message: "Course progress does not exist" });
        }
        return res.json({ success: true, message: "Course progress updated" });
    } catch (error) {
        console.error("Course progress update failed", error.name);
        return res.status(500).json({ success: false, message: "Unable to update course progress" });
    }
};
