const mongoose = require("mongoose");

const subSectionsSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    timeDuration: {
        type: String,
    },
    description: {
        type: String,
    },
    videoURL: {
        type: String,
    },
})

module.exports = mongoose.model("subSections", subSectionsSchema);