const mongoose = require("mongoose")

const EnquirySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    reply_message: {
        type: String,
        default: null
    },
    eventname: String,
    phone_number: Number,
    phone_code: Number,
    event_type: String,
    attendees: Number,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    enquire_status: {
        type: String,
        default: "pending",
        enum: ["active", "inactive", "pending"]
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

const Enquiry = mongoose.model("Enquiry", EnquirySchema);

module.exports = Enquiry;