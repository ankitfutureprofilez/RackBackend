const mongoose = require("mongoose");


const truckSchema = mongoose.Schema({
    truck_id: {
        type: String,
        required: [true, "Truck Id is Require"]
    },
    truck_number: {
        type: String,
        required: [true, "Truck Number is Require"]
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
})


const truck = mongoose.model("truck", truckSchema);

module.exports = truck;