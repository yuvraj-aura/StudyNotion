const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    gender: {
        type: String
    },
    DoB: {
        type: String,
    },
    about: {
        type: String,
        trim: true,
    },
    phoneNum: {
        type: Number,
        trim: true,
    },
})

module.exports = mongoose.model("Profile", profileSchema);