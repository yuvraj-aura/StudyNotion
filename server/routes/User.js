const express = require("express");
const router = express.Router();

const {
    login,
    signUp,
    sendOTP,
    changePassword,
} = require("../controllers/auth");

const {
    resetPasswordToken,
    resetPassword,
} = require("../controllers/resetPassword");

const { auth } = require("../middlewares/auth");

// Authentication routes
router.post("/login", login);
router.post("/signup", signUp);
router.post("/sendotp", sendOTP);
router.post("/sendOTP", sendOTP);
router.post("/changepassword", auth, changePassword);
router.post("/changePassword", auth, changePassword);

// Reset password routes
router.post("/reset-password-token", resetPasswordToken);
router.post("/resetPasswordToken", resetPasswordToken);
router.post("/reset-password", resetPassword);
router.post("/resetPassword", resetPassword);

module.exports = router;