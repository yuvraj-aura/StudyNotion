const { getClientUrl } = require("../config/clientUrl");
const User = require("../models/user");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// reset password token
exports.resetPasswordToken = async (req, res) => {
    try {
        // fetch email from req body
        const { email } = req.body;

        // check user for this email then email validation
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(403).json({
                success: false,
                message: `This Email: ${email} is not registered with us. Please enter a valid email`,
            });
        }

        // generate token
        const token = crypto.randomBytes(20).toString("hex");

        // uodate user by asking token and expiration time
        const updatedDetails = await User.findOneAndUpdate(
            { email: email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 5 * 60 * 1000,
            },
            { new: true },
        );

        // create url
        const URL = `${getClientUrl()}/update-password/${token}`;

        // send mail  containing the url
        await mailSender(
            email,
            "Password Reset",
            `Your Link for Password reset: ${URL}. Please click this url to reset your password`);


        // return response
        return res.json({
            success: true,
            message: 'Email sent successfully, please check your email and change your password',
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while sending Reset password link'
        })
    }

}


// reset password in db

exports.resetPassword = async (req, res) => {
    try {
        // fetching data 
        const { password, confirmPassword, token } = req.body;

        // validation
        if (password !== confirmPassword) {
            return res.status(403).json({
                success: false,
                message: "Passwords don't match",
            })
        }

        // get user details from db using token
        const userDetails = await User.findOne({ token: token });

        // if no entry invalid token
        if (!userDetails) {
            return res.status(401).json({
                success: false,
                message: 'Token is invalid',
            })
        }


        // token time cehcking
        if (userDetails.resetPasswordExpires < Date.now()) {
            return res.json({
                success: false,
                message: 'Token is expired, please regenerate your link',
            })
        }

        // hash new password
        const hashedPass = await bcrypt.hash(password, 10);

        // password update
        await User.findOneAndUpdate(
            { token: token },
            { password: hashedPass },
            { new: true },
        )

        // return response
        res.status(200).json({
            success: true,
            message: 'Password reset successful',
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while updating new password'
        })
    }
}
