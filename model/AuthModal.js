const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Please provide a username"],
            unique: true,
        },
        name: {
            type: String,
            required: [true, "Please provide a name"],
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
        },
        email: {
            type: String,
            required: [true, "Please provide an email"],
            unique: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
        },
        phone_number: {
            type: Number,
            required: [true, "Please provide a phone number"],
            validate: {
                validator: (value) => String(value).length >= 10,
                message: "Phone number must be at least 10 digits",
            },
        },
        role: {
            type: String,
            required: [true, "User role is required"],
            default: "user",
            enum: ["user", "admin"],
        },
        user_status: {
            type: String,
            default: "active",
            enum: ["active", "inactive"],
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
