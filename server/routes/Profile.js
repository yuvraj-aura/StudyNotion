const express = require("express");
const router = express.Router();

const {
    updateProfile,
    deleteAccount,
    getUserDetails,
    updateProfilePhoto,
    getEnrolledCourses,
    getUserCart,
    syncUserCart,
    changePassword,
    deleteProfile,
    instructorDashboard
} = require("../controllers/profile");

const { auth, isInstructor } = require("../middlewares/auth");

// Profile routes
router.get("/getUserDetails", auth, getUserDetails);
router.put("/updateProfile", auth, updateProfile);
router.delete("/deleteProfile", auth, deleteAccount);
router.put("/updateProfilePhoto", auth, updateProfilePhoto);
router.post("/changePassword", auth, changePassword);

// get enrolled courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses);

// get instructor dashboard
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard);

// User Cart database routes
router.get("/getUserCart", auth, getUserCart);
router.post("/syncUserCart", auth, syncUserCart);

router.delete("/deleteProfile", auth, deleteProfile);

module.exports = router;