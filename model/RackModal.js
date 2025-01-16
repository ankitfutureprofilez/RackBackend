const mongoose = require("mongoose");
const truck = require("./TruckModal");



const RackModal = mongoose.Schema({
    rack_id: {
        type: String,
        required: [true, "Rack Id is Require "]
    },
    rack_number: {
        type: String,
        required: [true, "Rack Number is Require "]
    },
    TruckId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "truck",
        required: [true, "Truck ID is required."],
    },
    status: {
        type: String,
        required: true,
        default: "active",
        enum: ["active", "inactive"]
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
})


const Rack = mongoose.model("Rack", RackModal);

module.exports = Rack;