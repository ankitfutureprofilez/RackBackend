const mongoose = require("mongoose")

const contactSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true
    },
    reply_message: {
        type: String,
    },
    phone_number: {
        type: Number,
    },
    phone_code: Number,
    contact_status: {
        type: String,
        default: "unread",
        enum: ["unread", "read"]
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;