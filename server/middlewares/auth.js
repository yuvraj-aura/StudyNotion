const JWT = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();


// auth middleware
exports.auth = async (req, res, next) => {
    try{
        // Extract token from cookies, body, or Authorization header
        const token =
            req.cookies?.token ||
            req.body?.token ||
            req.header("Authorization")?.replace("Bearer ", "");

        // if token missing then return resp
        if (!token){r
            return res.status(401).json({
                success: false,
                message: 'Token is missing',
            })
        }

        // verify the token
        try {
            const decode = JWT.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }
        catch(error){
            // verification issue
            return res.status(401).json({
                success: false,
                message: 'Token is invalid!',
            });
        }

        next();

    }catch (error){
        console.log(error);
        res.status(401).json({
            success: false,
            message: 'Something Went Wrong while validating the token',
        })
    }
}

// isStudent
exports.isStudent = async (req, res, next) => {
    try {
        if (req.user.accountType !== 'Student'){
            return res.status(401).json({
                success: false,
                message: 'This route is only for Students',
            })
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'User role  not verified. Please try again later',
        })
    }
}

// isAdmin
exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.accountType !== 'Admin') {
            return res.status(401).json({
                success: false,
                message: 'This route is only for Admins',
            })
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'User role  not verified. Please try again later',
        })
    }
}


// isInstructor 
exports.isInstructor = async (req, res, next) => {
    try {
        if (req.user.accountType !== 'Instructor') {
            return res.status(401).json({
                success: false,
                message: 'This route is only for Instructor',
            })
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'User role  not verified. Please try again later',
        })
    }
}