const Razorpay = require("razorpay");
const path = require("node:path");

require("dotenv").config({ path: path.join(__dirname, "../.env"), quiet: true });

const keyId = process.env.RAZORPAY_KEY;
const instance = new Razorpay({
    key_id: keyId,
    key_secret: process.env.RAZORPAY_SECRET,
});

module.exports = { instance, keyId };
