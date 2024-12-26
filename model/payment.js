const mongoose = require("mongoose");

const paymentmongoose = mongoose.Schema({
  srNo: {
    type: Number,
    required: true,
  },
  payment_status: {
    type: String,
    default: "pending",
    enum: ["pending", "success", "canceled"],
  },
  payment_type: {
    type: String,
    // required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  booking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
  },
  payment_id: {
    type: String,
    // required: true,
  },
  session_id: {
    type: String,
    // required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "USD",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const payment = mongoose.model("payment", paymentmongoose);

module.exports = payment;
