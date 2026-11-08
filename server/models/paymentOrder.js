const mongoose = require("mongoose");

const paymentOrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    courses: { type: [mongoose.Schema.Types.ObjectId], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    receipt: { type: String, required: true, unique: true },
    creatingUntil: Date,
    razorpayOrderId: { type: String, unique: true, sparse: true },
    paymentId: { type: String, unique: true, sparse: true },
}, { timestamps: true });

// A Razorpay order can remain payable after Checkout closes. Keep its courses
// reserved so a different order can never charge the same student for them.
paymentOrderSchema.index({ userId: 1, courses: 1 }, { unique: true });

module.exports = mongoose.model("PaymentOrder", paymentOrderSchema);
