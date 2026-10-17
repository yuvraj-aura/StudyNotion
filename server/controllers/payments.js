const { instance } = require("../config/razorpay");
const Course = require("../models/course");
const User = require("../models/user");
const mailSender = require("../utils/mailSender");
const { courseEnrollment } = require("../mail/templates/courseEnrollment");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");
const crypto = require("crypto");


// capture multiple payments
exports.capturePayments = async (req, res) => {
    try {
        // fetch details from req body
        const { courses } = req.body

        // fetching user id from req user
        const userId = req.user.id;

        if (courses.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide Course Id',
            });
        }

        for (const courseId of courses) {
            let course;
            try {
                course = await Course.findById(courseId);
                if (!course) {
                    return res.status(200).json({
                        success: false,
                        message: 'Could not find the course',
                    });
                }

                const uid = new mongoose.Schema.Types.ObjectId(userId);
                if (course.studentEnrolled.includes(uid)) {
                    return res.status(200).json({
                        success: false,
                        message: 'Student is already enrolled',
                    });
                }

                totalAmount += price;
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: error.message,
                });
            }
        }

        const options = {
            amount: totalAmount * 100,
            currency: "INR",
            reciept: Math.random(Date.now()).toString(),
        }

        try {
            const paymentResponse = await instance.orders.create(options);
            return res.status(200).json({
                success: true,
                message: 'Order created Successfully!',
                data: paymentResponse,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Could not Initiate Order',
                error: error.message,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: '',
            error: error.message
        });
    }
};

exports.verifyPayment = async (req, res) => {
    // fetch details from req body
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courseId = req.body?.courses;
    const userId = req.user.id;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courseId || !userId) {
        return res.status(500).json({
            success: false,
            message: 'Payment failed',
        });
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        // student ko enroll karwao
        await enrollStudent(courses, userId, res);
        // return res
        return res.status(200).json({
            success: true,
            message: 'Payment Verified Successfully',
            // data: ,
        });

    }

    return res.status(500).json({
        success: false,
        message: 'Could not verify payment',
        error: error.message
    });

};

const enrollStudent = async (courses, userId, res) => {

    // data validation
    if (!courses || !userId) {
        return res.status(400).json({
            success: false,
            message: 'Please provide all data',
        });
    }

    // since we have multiple courses, har course ke andr enroll krwo
    for (const courseId of courses) {
        try {
            // find the course and enroll the student
            const enrolledCourse = await Course.findOneAndUpdate(
                { _id: courseId },
                {
                    $push: {
                        studentEnrolled: userId
                    },
                },
                { new: true },
            )

            if (!enrolledCourse) {
                return res.status(500).json({
                    success: false,
                    message: 'Course not found',
                });
            }

            // find the student and add the course to teir list of enrolled courses
            const enrolledStudent = await User.findByIdAndUpdate(
                userId,
                {
                    $push: {
                        courses: courseId,
                    }
                },
                { new: true },
            )

            // send mail to student after course enrollment
            const mailResponse = await mailSender(
                enrollStudent.email,
                `Successfully enrolled into ${enrolledCourse.name}`,
                courseEnrollment(enrolledCourse.name, `${enrolledStudent.firstName}`)
            )

            console.log("Email sent successfully ->>", mailResponse)
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Failed to enroll Student',
            });
        }
    }
}

exports.sendPaymentSuccessEmail = async (req, res) => {
    const { orderId, paymentId, amount } = req.body;

    const userId = req.user.id;

    if (!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({
            success: false,
            message: 'Please provide all the details',
        });
    }

    try {
        // student ko dhundo
        const enrolledStudent = await User.findById(userId);
        mailSender(
            enrolledStudent.email,
            "Payment Recieved",
            paymentSuccessEmail(`${enrolledStudent.firstName}`, amount / 100, orderId, paymentId)
        )

    } catch (err) {
        console.log("Error in sending mail ->> ", error)
        return res.status(500).json({
            success: false,
            message: 'Could not send email',
        });
    }


}