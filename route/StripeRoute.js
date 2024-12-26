const StripeRoute = require("express").Router();
const { createCheckout, PaymentGet, PaymentSuccess, PaymentCancel, PaymentGetByID, PackagegetByBookingId } = require("../controller/StripeController");

StripeRoute.post("/create-checkout-session", createCheckout);

StripeRoute.get("/payment-get", PaymentGet);

StripeRoute.get("/payment-success/:srNo", PaymentSuccess)

StripeRoute.get("/payment-cancel/:srNo", PaymentCancel)

StripeRoute.get("/getByID/:booking_id", PaymentGetByID)

StripeRoute.get("/payment/:booking_id", PackagegetByBookingId)



module.exports = StripeRoute;