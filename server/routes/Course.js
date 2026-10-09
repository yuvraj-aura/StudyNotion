const express = require("express");
const router = express.Router();

const {
    createCourse,
    showAllCourses,
    getCourseDetails,
} = require("../controllers/course");

const {
    createCategory,
    showAllCategories,
    categoryPageDetails,
} = require("../controllers/category");

const {
    createSection,
    updateSection,
    deleteSection,
} = require("../controllers/section");

const {
    createSubSection,
    updateSubSection,
    deleteSubSection,
} = require("../controllers/subSection");

const {
    createRating,
    getAvgRatings,
    getAllRatingAndReview,
} = require("../controllers/ratingAndReview");

const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth");

// Course routes
router.post("/createCourse", auth, isInstructor, createCourse);
router.post("/addSection", auth, isInstructor, createSection);
router.post("/updateSection", auth, isInstructor, updateSection);
router.post("/deleteSection", auth, isInstructor, deleteSection);
router.delete("/deleteSection/:sectionId", auth, isInstructor, deleteSection);

// SubSection routes
router.post("/addSubSection", auth, isInstructor, createSubSection);
router.post("/updateSubSection", auth, isInstructor, updateSubSection);
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);
router.delete("/deleteSubSection", auth, isInstructor, deleteSubSection);

// Get Courses routes
router.get("/getAllCourses", showAllCourses);
router.post("/showAllCourses", showAllCourses);
router.post("/getCourseDetails", getCourseDetails);

// Category routes
router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);
router.post("/categoryPageDetails", categoryPageDetails);

// Rating and Review routes
router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAvgRatings);
router.post("/getAvgRatings", getAvgRatings);
router.get("/getReviews", getAllRatingAndReview);
router.get("/getAllRatingAndReview", getAllRatingAndReview);

module.exports = router;