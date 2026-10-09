const express = require("express");
const router = express.Router();

const {
    updateProfile,
    deleteAccount,
    getUserDetails,
    updateProfilePhoto,
    getEnrolledCourses,
} = require("../controllers/profile");

const { auth } = require("../middlewares/auth");

// Profile routes
router.put("/updateProfile", auth, updateProfile);

router.delete("/deleteProfile", auth, deleteAccount);

router.get("/getUserDetails", auth, getUserDetails);

router.put("/updateProfilePhoto", auth, updateProfilePhoto);
router.get("/getEnrolledCourses", auth, getEnrolledCourses);

module.exports = router;