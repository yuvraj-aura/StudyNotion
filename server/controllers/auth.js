const User = require("../models/user");
const OTP = require("../models/otp");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const Profile = require("../models/profile")

require("dotenv").config();


// send otp
exports.sendOTP = async (req, res) => {
    try {
        // fetch email from req body
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const userExisted = await User.findOne({ email });
        if (userExisted) {
            return res.status(401).json({
                success: false,
                message: 'User already exists!',
            });
        }

        // generate otp 
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        console.log("Generated OTP: ", otp);

        // check uniqueness in database
        let result = await OTP.findOne({ otp: otp });

        // regenerate otp until a unique one is found
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({ otp: otp });
        }

        // store otp in db
        const otpPayload = { email, otp };
        const otpBody = await OTP.create(otpPayload);
        console.log("Body of OTP ->>", otpBody);

        res.status(200).json({
            success: true,
            data: otpBody,
            message: 'OTP sent successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



// signup
exports.signUp = async (req, res) => {
    try {
        // fetch email from req body
        const { firstName, lastName, email, password, confirmPass, accountType, phoneNum, otp } = req.body;

        // valide email and password
        if (!firstName || !lastName || !email || !password || !confirmPass || !otp) {
            return res.status(403).json({
                success: false,
                message: 'Please fill all the details carefully!',
            })
        }

        // compare both passwords
        if (password !== confirmPass) {
            return res.status(400).json({
                success: false,
                message: "Passwords don't match",
            })
        }

        // user already exists or not
        const userExisted = await User.findOne({ email });

        // return -ve  resp, if user already registered
        if (userExisted) {
            return res.status(401).json({
                success: false,
                message: 'User already exists. Please sign in to continue',
            })
        }

        // find most receent otp stored for user
        const recentOTP = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log(recentOTP);

        // validate OTP
        if (recentOTP.length == 0) {
            // OTP not found
            return res.status(400).json({
                success: false,
                message: 'The OTP is not valid'
            })
        }
        else if (otp !== recentOTP[0].otp) {
            // Invalid OTP
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            })
        }

        // hash password
        let hashPassword = await bcrypt.hash(password, 10);

        // create the user
        let approved = "";
        approved === "Instructor" ? (approved = false) : (approved = true);


        // creating first null profile for new user
        const profileDetails = await Profile.create({
            gender: null,
            DoB: null,
            about: null,
            phoneNum: null,
        })

        // create entry in DB
        const user = await User.create({
            firstName,
            lastName,
            email,
            phoneNum,
            password: hashPassword,
            accountType: accountType,
            approved: approved,
            image: `https://ui-avatars.com/api/?name=${firstName} ${lastName}`,
            userProfileDetails: profileDetails._id,
        })

        // return +ve resp
        return res.status(200).json({
            success: true,
            data: user,
            message: 'Account created successfully'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'User cannot be registered at this moment. Please try again later!',
        });
    }
}



// login
exports.login = async (req, res) => {
    try {
        // fetching details from req body
        const {email, password} = req.body

        // validation data
        if (!email || !password){
            return res.status(403).json({
                success: false,
                message: 'Please fill all the details carefully!',
            })
        }

        // user already registed or not
        const user = await User.findOne({email}).populate("userProfileDetails");

        if (!user){
            return res.status(401).json({
                success: false,
                message: 'User is not registered!',
            })
        }

        // password matching then generate token 
        if (await bcrypt.compare(password, user.password)){
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }

            const token = JWT.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });
            user.token = token;
            user.password = undefined;


            // creating cookie and sending response
            const options = {
                expires: new Date(Date.now() + 3*24*60*60 * 1000),
                httpsOnly: true,
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                data: user,
                message: 'Logged In successfully!',
            })
        }
        else{
            return res.status(401).json({
                success: false,
                message: 'Password is incorrect',
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


 
// change pass
exports.changePassword = async (req, res) => {
    try {
        // fetching data from req body
        const {email, newPassword, newConfirmPassword} = req.body; 

        // validation
        if (!email || !newPassword || !newConfirmPassword){
            return res.status(403).json({
                success: false,
                message: 'Please fill all the details carefully!',
            })
        }

        // get old password, new password, confirm password
        const existedUser = await User.findOne({email});
        
        // validation passes, then update password in DB
        if (newPassword !== newConfirmPassword){
            return res.status(401).json({
                success: false,
                message: 'Passwords do not match',
            })
        }

        const updatedUserDetails = await User.findOneAndUpdate(
            {email: email},
            {
                password: newPassword,
            },
            {new: true},
        )

        // send mail - passwrod updated
        await mailSender(email, "Password Changed", `Your password has been changed successfully.`);

        //  return response
        res.status(200).json({
            success: true,
            data: otpBody,
            message: 'Password changed Successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
