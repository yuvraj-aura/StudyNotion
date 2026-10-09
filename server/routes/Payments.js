const express = require("express");
const router = express.Router();

const { capturePayment, verifySignature } = require("../controllers/payments");
const { auth, isStudent } = require("../middlewares/auth");

// Payment routes
router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/verifySignature", verifySignature);

module.exports = router;