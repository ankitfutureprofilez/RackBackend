const mongoose = require("mongoose");

const Inventoryschema = mongoose.Schema({
    inventory_id: {
        type: String,
        required: [true, "Inventory ID is required"]
    },
    name: {
        type: String,
        required: [true, "Inventory name is required"]
    },
    categrios: {
        type: String,
        required: [true, "Category is required"],
        default: "material",
        enum: ["material", "tools"]
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"]
    },
    Image: {
        type: String,
        required: [true, "Image URL is required"]
    },
    description: {
        type: String,
        // required: [true, "Description is required"]
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // required: [true, "User ID is required."],
    },
});

const Inventory = mongoose.model("Inventory", Inventoryschema);

module.exports = Inventory;
