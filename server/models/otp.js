const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
        expires: 5*60,
    },
    otp: {
        type: String,
        required: true,
    },
})

//  fn -> to send emails
async function sendVerificationEmail(email, otp){
    try{
        const mailResponse = await mailSender(email, "Verification Email from StudyNotion", otp);

        console.log("Email sent successfully: ", mailResponse);
    }catch(err) {
        console.log("Error occured while sending mail: ", err);
        throw err;
    }
}

otpSchema.pre("save", async function() {
    await sendVerificationEmail(this.email, this.otp);
})

module.exports = mongoose.model("OTP", otpSchema);