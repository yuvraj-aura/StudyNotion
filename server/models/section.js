const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    sectionName: {
        type: String,
    },
    subsections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "subSections",
        required: true,
    }],
},
    //  { timestamps: true }
);

module.exports = mongoose.model('Section', sectionSchema);