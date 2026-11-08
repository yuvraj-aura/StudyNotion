import { apiConnector } from "../apiConnector";
import { studentEndpoints } from "../APIs";
import { toast } from "react-hot-toast";
import rzpLogo from "../../assets/Logo.svg";
import { setPaymentLoading } from "../../redux/slices/cartSlice";
import { getUserCartFromDB } from "./cartAPI";

const { COURSE_PAYMENT_API, COURSE_VERIFY_API } = studentEndpoints;
let checkoutScript;
let checkoutActive = false;

function loadCheckout() {
    if (typeof window.Razorpay === "function") return Promise.resolve();
    checkoutScript ??= new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve();
        script.onerror = () => {
            script.remove();
            reject(new Error("Razorpay Checkout could not load"));
        };
        document.body.appendChild(script);
    }).catch((error) => {
        checkoutScript = undefined;
        throw error;
    });
    return checkoutScript;
}

export async function buyCourse({ courses, token, userDetails, navigate, dispatch }) {
    if (checkoutActive) return;
    checkoutActive = true;
    dispatch(setPaymentLoading(true));
    const toastId = toast.loading("Preparing checkout...");
    const headers = { Authorization: "Bearer " + token };
    let verifying = false;

    const releaseCheckout = () => {
        checkoutActive = false;
        dispatch(setPaymentLoading(false));
        toast.dismiss(toastId);
    };

    const showEnrollment = () => {
        toast.success("Payment confirmed. You are enrolled.");
        navigate("/dashboard/enrolled-courses");
        void dispatch(getUserCartFromDB(token));
    };

    try {
        await loadCheckout();
        if (typeof window.Razorpay !== "function") {
            checkoutScript = undefined;
            throw new Error("Razorpay Checkout could not load");
        }

        const { data: result } = await apiConnector("POST", COURSE_PAYMENT_API, { courses }, headers);
        if (!result.success) throw new Error(result.message || "Could not create an order");

        const { enrolled, id, amount, currency, keyId } = result.data;
        if (enrolled) {
            showEnrollment();
            releaseCheckout();
            return;
        }
        if (!id || !keyId || !currency || !Number.isSafeInteger(amount)) {
            throw new Error("Checkout order details are incomplete");
        }

        const checkout = new window.Razorpay({
            key: keyId,
            currency,
            amount,
            order_id: id,
            name: "StudyNotion",
            description: "Course purchase",
            image: rzpLogo,
            prefill: { name: userDetails?.firstName, email: userDetails?.email },
            modal: {
                ondismiss: () => {
                    if (!verifying) releaseCheckout();
                },
            },
            handler: async (payment) => {
                verifying = true;
                toast.loading("Verifying payment...", { id: toastId });
                try {
                    const { data } = await apiConnector("POST", COURSE_VERIFY_API, payment, headers);
                    if (!data.success || !data.data?.enrolled) throw new Error("Enrollment is pending");
                    showEnrollment();
                } catch (error) {
                    toast.error(error.response?.data?.message ||
                        "Could not confirm enrollment. Resume checkout to check your payment.");
                } finally {
                    releaseCheckout();
                }
            },
        });

        checkout.on("payment.failed", () => toast.error("Payment failed. You can retry in Checkout."));
        checkout.open();
        toast.dismiss(toastId);
    } catch (error) {
        releaseCheckout();
        toast.error(error.response?.data?.message || error.message || "Could not open checkout");
    }
}
