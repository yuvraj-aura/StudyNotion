const express = require("express");
const router = express.Router();

const { capturePayments, verifyPayment, sendPaymentSuccessEmail } = require("../controllers/payments");
const { auth, isStudent } = require("../middlewares/auth");

// Payment routes
router.post("/capturePayment", auth, isStudent, capturePayments);
router.post("/verifyPayment", auth, isStudent, verifyPayment);
router.post("/sendPaymentSuccessEmail", auth, isStudent, sendPaymentSuccessEmail);


module.exports = router;