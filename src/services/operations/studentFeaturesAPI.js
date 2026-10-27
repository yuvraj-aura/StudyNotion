import { apiConnector } from "../apiConnector";
import { studentEndpoints } from "../APIs";
import toast from "react-hot-toast";
import rzpLogo from "../../assets/Logo.svg";
import { Navigate } from "react-router-dom";

const { COURSE_PAYMENT_API, SEND_PAYMENT_SUCCESS_EMAIL_API, COURSE_VERIFY_API } = studentEndpoints

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;

        script.onload = () => {
            resolve(true);
        }

        script.onerror = () => {
            resolve(false);
        }
        document.body.appendChild(script);
    })
}

export async function buyCourse({ courses, token, userDetails, navigate, dispatch }) {
    const toastId = toast.loading("Loading...");
    try {
        // load the script
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if (!res) {
            toast.error("Razorpay SDK failed to load");
        }

        // initiate the order
        const orderResponse = await apiConnector(
            "POST",
            COURSE_PAYMENT_API,
            { courses },
            {
                Authorization: `Bearer ${token}`
            }
        );

        if (!orderResponse.data.success) {
            throw new Error(orderResponse.data.message);
        }

        const options = {
            key: process.env.RAZORPAY_KEY,
            currency: orderResponse.data.message.currency,
            amount: `${orderResponse.data.message.amount}`,
            order_id: orderResponse.data.message.id,
            name: "StudyNotion",
            description: "Thank you for purchasing the course",
            image: rzpLogo,
            prefill: {
                name: `${userDetails.firstName}`,
                email: `${userDetails.email}`,
            },
            handler: function (response) {
                // send successful mail
                sendPaymentSuccessEmail(
                    response,
                    orderResponse.data.message.amount,
                    token,
                );

                // verify payment
                verifyPayment({ ...response, courses }, token, navigate, dispatch);
            }
        }

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("Payment failed, ", function(response){
            toast.error("oops Payment Failed")
            console.log(response.error)
        })
    } catch (err) {
        console.log("Payment API Error...")
        toast.error("Could not make payment");
    }
    toast.dismiss(toastId);
}

async function sendPaymentSuccessEmail(response, amount, token) {
    try {
        await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            amount,
        }, {
            Authorization: `Bearer ${token}`
        })
    } catch (err) {
        console.log("Payment success email error...", err)
    }
}

// verify payment
async function verifyPayment(bodyData, token, navigate, dispatch) {
    const toastId = toast.loading("Verifying Payment...");
    dispatch(setPaymentLoading(true));
    try {
        const response = await apiConnector(
            "POST",
            COURSE_VERIFY_API,
            bodyData,
            {
                Authorizatoin: `Bearer ${token}`,
            }
        )
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        toast.success("Payment Successful, you are enrolled in the course");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());

    } catch (err) {
        console.log("Payment VERIFY ERROR...", err);
        toast.error("Could not verify payment");
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}