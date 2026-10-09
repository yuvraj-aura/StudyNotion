const { instance } = require("../config/razorpay");
const Course = require("../models/course");
const User = require("../models/user");
const mailSender = require("../utils/mailSender");
const { courseEnrollment } = require("../mail/templates/courseEnrollment");

// capture the payment->>initiate the razorpay order
exports.capturePayment = async (req, res) => {
    // fetch details from req body
    const { course_Id } = req.body

    // get courseId and userID
    const userId = req.user.id;

    // data validation
    if (!course_Id) {
        return res.json({
            success: false,
            message: 'Pleae provide valid course ID'
        });
    }

    // valid course id and valid course details
    let course;
    try {
        course = await Course.findById(course_Id);
        if (!course) {
            return res.json({
                success: false,
                message: 'Could not find the course',
            });
        }

        // user already paid or not for same course
        // previously userId is stored in form of STring and in user, it is stored in the form of ObjectID
        const UID = new mongoose.Types.ObjectId(userId);
        if (course.studentEnrolled.includes(UID)) {
            return res.status(200).json({
                message: false,
                message: 'Student is already enrolled',
            })
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to find the course at this moment. Please try again later',
            error: error.message
        });
    }


    // create order for rzpy
    const amount = course.price;
    const currency = "INR";

    const options = {
        amount: amount * 100,
        currency,
        reciept: Math.random(Date.now()).toString(),
        notes: {
            courseId: course_Id,
            userId,
        }
    };

    try {
        // initiating the payment using razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);

        return res.status(200).json({
            success: true,
            message: 'Payment initiated Successfully!',
            courseName: course.name,
            courseDescription: course.description,
            thumbnail: course.thumbnail,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Could not initiate order',
            error: error.message
        });

    }
};

// verify signature of rzorpay and server
exports.verifySignature = async (req, res) => {
    const webhookSecret = "12345678";

    const signatureRzp = req.headers("x-razorpay-signature");

    const shaSum = crypto.createHmac("sha256", webhook);
    shaSum.update(JSON.stringify(req.body));
    const digest = shaSum.digest("hex");

    if (signatureRzp === digest) {
        console.log("Payment is authorised");

        // hashed based message authentication code - isko 2 cheez chahiye: ek sorting algo and one is secret key - why needed? cleint ki messageki authenticity check krna.

        // secure hashing algo (SHA) - ek aisa algo jisse data ko ek encrypted format me convert krta h

        const { courseId, userId } = req.body.payload.payment.entity.notes;

        try {
            // no need to validate as we already validated at the time of pushing


            // find the course and enrolll the student in it
            const enrolledCourse = await Course.findOneAndUpdate(
                { _id: courseId },
                {
                    $push: {
                        studentEnrolled: userId,
                    },
                },
                { new: true },
            );

            if (!enrolledCourse) {
                return res.status(500).json({
                    success: false,
                    message: 'Course not found',
                })
            }

            console.log(enrolledCourse);

            // find the studnet and add the course to their list enrolled course
            const enrolledStudent = await User.findOneAndUpdate(
                { _id: userId },
                {
                    $push: {
                        courses: courseId
                    },
                },
                { new: true },
            )
            // c
            console.log(enrolledStudent);


            // send mail after updating course and user
            const emailResponse = await mailSender(
                enrolledStudent.email,
                "Congratulations, from NoRes",
                "Congratulations, you are onboarded into new StudyNotion courses.",
            );

            console.log(emailResponse);

            return res.status(200).json({
                success: true,
                message: 'Signature Verified and Course added Successfully!',
                // data: ,
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: '',
                error: error.message
            });
        }
    }
    else{
        return res.status(400).json({
            success: false,
            message: 'Invalid request',
        })
    }
}; 