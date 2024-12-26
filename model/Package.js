const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema({
    package_name: {
        type: String,
        required: true
    },
    package_services: {
        type: Array,
        required: true
    },
    package_subtitle: {
        type: String,
    },
    package_description: {
        type: String,
        required: true
    },
    package_price_min: {
        type: Number,

    },
    package_price_max: {
        type: Number,
    },
    package_status: {
        type: String,
        default: "active",
        enum: ["active", "inactive"]
    },
    package_image: {
        type: String,

    },
    fileId: {
        type: String,
        default: null
    },
    package_duration: {
        type: Number,
        min: 1
    },
    package_discount: {
        type: Number,
        default: 0,
        min: 0
    },
    package_people: {
        type: Number,
        required: true,
        min: 1
    },
    package_availability: {
        type: String,
        default: "available",
        enum: ["available", "outOfStock"]
    },
    event_type: String,
    event_food: String,
    event_activity: String,
    services: String,
    created_at: {
        type: Date,
        default: Date.now
    },
});


const Package = mongoose.model("Package", PackageSchema);

module.exports = Package;
