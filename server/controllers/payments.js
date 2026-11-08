const crypto = require("node:crypto");
const mongoose = require("mongoose");
const { instance, keyId } = require("../config/razorpay");
const Course = require("../models/course");
const User = require("../models/user");
const CourseProgress = require("../models/courseProgress");
const PaymentOrder = require("../models/paymentOrder");
const mailSender = require("../utils/mailSender");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");

function failure(res, status, message) {
    return res.status(status).json({
        success: false,
        message
    });
}

function matchesSignature(expected, signature) {
    return typeof signature === "string" && /^[a-f0-9]{64}$/i.test(signature) &&
        crypto.timingSafeEqual(expected, Buffer.from(signature, "hex"));
}

function confirmed(res, order) {
    return res.json({
        success: true,
        data: {
            enrolled: true,
            courses: order.courses
        }
    });
}

async function ensureProviderOrder(order) {
    if (order.razorpayOrderId)
        return order.razorpayOrderId;

    const now = new Date();
    const reservation = await PaymentOrder.findOneAndUpdate(
        {
            _id: order._id,
            razorpayOrderId: { $exists: false },
            $or: [{ creatingUntil: { $exists: false } }, { creatingUntil: { $lte: now } }],
        },
        {
            $set: {
                creatingUntil: new Date(now.getTime() + 60_000)
            }
        },
    );
    if (!reservation) {
        const latest = await PaymentOrder.findById(order._id);
        if (latest?.razorpayOrderId) {
            order.razorpayOrderId = latest.razorpayOrderId;
            return latest.razorpayOrderId;
        }
        return null;
    }

    const findByReceipt = async () => {
        const { items } = await instance.orders.all({
            receipt: order.receipt,
            count: 10
        });
        return items.find((item) => item.receipt === order.receipt);
    };

    let providerOrder = await findByReceipt();
    if (!providerOrder) {
        try {
            providerOrder = await instance.orders.create({
                amount: order.amount,
                currency: order.currency,
                receipt: order.receipt,
            });
        } catch (error) {
            // A concurrent request or lost response may have created this receipt.
            providerOrder = await findByReceipt();
            if (!providerOrder) throw error;
        }
    }
    if (providerOrder.amount !== order.amount || providerOrder.currency !== order.currency) {
        throw new Error("Provider order does not match the reserved purchase");
    }

    await PaymentOrder.updateOne(
        {
            _id: order._id,
            razorpayOrderId: {
                $exists: false
            }
        },
        {
            $set:
            {
                razorpayOrderId: providerOrder.id

            },
            $unset: {
                creatingUntil: 1
            }
        },
    );
    order.razorpayOrderId = providerOrder.id;
    return providerOrder.id;
}

async function fulfill(order, payment) {
    if (payment.status !== "captured" || payment.order_id !== order.razorpayOrderId ||
        payment.amount !== order.amount || payment.currency !== order.currency) {
        return false;
    }

    const receiptRecipient = await mongoose.connection.transaction(async (session) => {
        const claimed = await PaymentOrder.findOneAndUpdate(
            { _id: order._id, paymentId: { $exists: false } },
            { $set: { paymentId: payment.id } },
            { session },
        );
        if (!claimed) {
            const existing = await PaymentOrder.findById(order._id).session(session);
            if (existing?.paymentId !== payment.id) throw new Error("Payment already claimed");
            return null;
        }

        for (const courseId of order.courses) {
            const result = await Course.updateOne(
                { _id: courseId },
                { $addToSet: { studentEnrolled: order.userId } },
                { session },
            );
            if (!result.matchedCount) throw new Error("Purchased course no longer exists");

            await CourseProgress.updateOne(
                { courseId, userId: order.userId },
                { $setOnInsert: { completedVideos: [] } },
                { session, upsert: true },
            );
        }

        const user = await User.findByIdAndUpdate(order.userId, {
            $addToSet: { courses: { $each: order.courses } },
            $pull: { cart: { $in: order.courses } },
        }, { session, returnDocument: "after" });
        if (!user) throw new Error("Purchasing user no longer exists");
        return { email: user.email, name: user.firstName };
    });

    if (receiptRecipient) {
        void mailSender(
            receiptRecipient.email,
            "Payment Received - Your StudyNotion Receipt",
            paymentSuccessEmail(receiptRecipient.name, order.amount / 100, order.razorpayOrderId, payment.id),
        ).catch(() => console.error("Payment receipt delivery failed"));
    }
    return true;
}

exports.capturePayments = async (req, res) => {
    const requested = req.body?.courses;
    if (!Array.isArray(requested) || requested.length === 0 ||
        requested.some((id) => typeof id !== "string" || !mongoose.isObjectIdOrHexString(id))) {
        return failure(res, 400, "Provide valid course IDs");
    }
    const courses = [...new Set(requested.map((id) => id.toLowerCase()))].sort();
    const userId = req.user.id;

    try {
        // The unique reservation index must exist before accepting an order.
        await PaymentOrder.init();
        let order = await PaymentOrder.findOne({ userId, courses: { $in: courses } });
        if (!order) {
            const selected = await Course.find({ _id: { $in: courses }, status: "Published" });
            if (selected.length !== courses.length) return failure(res, 404, "Course unavailable");

            let amount = 0;
            for (const course of selected) {
                if (course.studentEnrolled.some((id) => String(id) === String(userId))) {
                    return failure(res, 409, "You are already enrolled in a selected course");
                }
                const paise = Math.round(course.price * 100);
                if (!Number.isSafeInteger(paise) || paise <= 0 ||
                    Math.abs(course.price * 100 - paise) > 1e-7) {
                    return failure(res, 422, "A selected course has an invalid price");
                }
                amount += paise;
            }
            if (!Number.isSafeInteger(amount) || amount < 100) {
                return failure(res, 422, "Invalid order total");
            }

            try {
                order = await PaymentOrder.create({
                    userId, courses, amount, currency: "INR", receipt: crypto.randomUUID(),
                });
            } catch (error) {
                if (error.code !== 11000) throw error;
                order = await PaymentOrder.findOne({ userId, courses: { $in: courses } });
                if (!order) throw error;
            }
        }

        if (order.courses.map(String).sort().join(",") !== courses.join(",")) {
            return failure(res, 409, "A selected course is in another checkout. Resume that checkout with its original courses.");
        }
        if (order.paymentId) return confirmed(res, order);

        const hadProviderOrder = Boolean(order.razorpayOrderId);
        const id = await ensureProviderOrder(order);
        if (!id) return failure(res, 409, "Checkout is being prepared. Please try again shortly.");
        if (hadProviderOrder) {
            const { items } = await instance.orders.fetchPayments(id);
            const captured = items.find((payment) => payment.status === "captured");
            if (captured) {
                if (await fulfill(order, captured)) return confirmed(res, order);
                return failure(res, 409, "Captured payment does not match the order");
            }
            if (items.some((payment) => payment.status === "authorized")) {
                return failure(res, 409, "Payment is awaiting capture. Check again shortly.");
            }
        }

        return res.json({
            success: true,
            data: { id, keyId, amount: order.amount, currency: order.currency },
        });
    } catch (error) {
        console.error("Order setup failed", error.code ?? error.statusCode ?? error.name);
        return failure(res, 503, "Could not prepare checkout. Retry to resume the same order.");
    }
};

exports.verifyPayment = async (req, res) => {
    const {
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature
    } = req.body ?? {};


    if (typeof orderId !== "string" ||
        typeof paymentId !== "string" ||
        !/^order_[a-z0-9]+$/i.test(orderId) ||
        !/^pay_[a-z0-9]+$/i.test(paymentId)) {
        return failure(res, 400, "Invalid payment details");
    }

    try {
        const order = await PaymentOrder.findOne({
            razorpayOrderId: orderId,
            userId: req.user.id
        });

        if (!order)
            return failure(res, 404, "Order not found");

        const expected = crypto.createHmac(
            "sha256",
            process.env.RAZORPAY_SECRET
        )
            .update(order.razorpayOrderId + "|" + paymentId)
            .digest();


        if (!matchesSignature(expected, signature)) 
            return failure(res, 400, "Invalid payment signature");


        if (order.paymentId === paymentId) 
            return confirmed(res, order);

        if (order.paymentId) 
            return failure(res, 409, "Order is already fulfilled");

        const payment = await instance.payments.fetch(paymentId);
        if (!await fulfill(order, payment)) {
            return failure(res, 409, "Payment capture is pending or payment details do not match");
        }
        
        return confirmed(res, order);

    } catch (error) {
        console.error("Payment verification failed", error.code ?? error.statusCode ?? error.name);
        return failure(res, 503, "Could not confirm enrollment. Resume checkout to check the payment again.");
    }
};

exports.paymentWebhook = async (req, res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret || !Buffer.isBuffer(req.body)) return res.sendStatus(404);
    const expected = crypto.createHmac("sha256", secret).update(req.body).digest();
    if (!matchesSignature(expected, req.get("X-Razorpay-Signature"))) return res.sendStatus(400);

    try {
        const event = JSON.parse(req.body.toString("utf8"));
        if (event.event !== "payment.captured") return res.sendStatus(204);

        const payment = event.payload?.payment?.entity;
        if (!payment?.id || !payment.order_id) return res.sendStatus(400);
        const order = await PaymentOrder.findOne({ razorpayOrderId: payment.order_id });
        if (!order) return res.sendStatus(204);
        if (!await fulfill(order, payment)) return res.sendStatus(409);
        return res.sendStatus(204);
    } catch (error) {
        console.error("Payment webhook failed", error.code ?? error.name);
        return res.sendStatus(503);
    }
};
