const express = require("express");
const router = express.Router();

const { capturePayments, verifyPayment } = require("../controllers/payments");
const { auth, isStudent } = require("../middlewares/auth");

// Payment routes
router.post("/capturePayment", auth, isStudent, capturePayments);
router.post("/verifyPayment", auth, isStudent, verifyPayment);


module.exports = router;