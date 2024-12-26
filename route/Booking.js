const bookingroute = require("express").Router();

const { verifyToken } = require("../controller/AuthController");

const { bookingpost, BookingGet, BookingStatus, BookingPayment, BookingPrice, BookingGetByID, BookingPaymentId, deleteServiceProvider, updateServiceProviderPackage } = require("../controller/BookingController");
const getRateMiddleware = require("../utils/getRateMiddleware");

bookingroute.post("/booking-add", verifyToken, bookingpost)

bookingroute.get("/booking-get", BookingGet)

bookingroute.post("/booking-status", BookingStatus)

bookingroute.post("/update-price", BookingPrice)

bookingroute.post("/booking-payment", getRateMiddleware, BookingPayment)

bookingroute.get("/getByID/:id", BookingGetByID)

bookingroute.get("/payment/:id", BookingPaymentId)

// bookingroute.post("/booking-filter", BookingFilter);
bookingroute.get("/delete-booking/:Id/:placeId" , deleteServiceProvider)

bookingroute.post("/update-booking" , updateServiceProviderPackage)


module.exports = bookingroute