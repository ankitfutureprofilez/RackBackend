const Stripe = require("stripe");
const catchAsync = require("../utils/catchAsync");
const Payment = require("../model/payment.js");
const stripe = new Stripe(process.env.STRIPE_TEST_KEY);
const sendEmail = require("../utils/EmailMailler");
const emailTemplate = require("../emailTemplates/Payment.js");
const Booking = require("../model/Booking");
const User = require("../model/User");
const logger = require("../utils/Logger.js");

const fetchPaymentId = async (sessionId, srNo) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paymentId = session.payment_intent;
    if (!srNo) {
      return;
    }
    const data = await Payment.findOne({ srNo: srNo });
    if (!data) {
      return null;
    }
    data.payment_id = paymentId;
    // datas.payment_type = data.paymentMethod;
    await data.save();
    return paymentId;
  } catch (error) {
    console.error("Error fetching payment ID:", error);
    logger.error("Error fetching payment ID:", error);
    return null;
  }
};

const PaymentFilter = async (name) => {
  try {
    if (!name) {
      return res.status(400).json({
        status: false,
        message: "Name is required for filtering payments.",
      });
    }
    const matchingUserIds = await User.find({
      username: { $regex: name, $options: "i" },
    }).distinct("_id");

    const matchingBookingIds = await Booking.find({
      package_name: { $regex: name, $options: "i" },
    }).distinct("_id");

    const payments = await Payment.find({
      $or: [
        { userId: { $in: matchingUserIds } },
        { booking_id: { $in: matchingBookingIds } },
      ],
    })
      .populate({ path: "userId", select: "username email" })
      .populate({ path: "booking_id", select: "package_name location" });

    return payments;
  } catch (error) {
    console.error("Error fetching payments:", error);
    logger.error("Error fetching payments:", error);
    return res.status(500).json({
      status: false,
      message: "An error occurred while fetching payments.",
      error: error.message,
    });
  }
};


exports.createCheckout = catchAsync(async (req, res) => {
  try {
    const { amount, email, userId, booking_id, currency } = req?.body;
    const lastpayment = await Payment.findOne().sort({ srNo: -1 });
    const srNo = lastpayment ? lastpayment.srNo + 1 : 1;
    const amountInCents = Math.round(amount * 100);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment', // Correct mode value
      success_url: `https://user-event.vercel.app/success/${srNo}`,
      cancel_url: `https://user-event.vercel.app/cancel/${srNo}`,
      submit_type: "pay",
      customer_email: email,
      billing_address_collection: "auto",
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: "Booking Payment",
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
    });


    const newPayment = new Payment({
      srNo,
      payment_type: "card",
      payment_id: null,
      session_id: session?.id,
      currency,
      userId,
      booking_id,
      amount,
    });
    await newPayment.save();
    res.status(200).json({ url: session.url, status: "true" });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

exports.PaymentGet = catchAsync(async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const search = req.query.search || "";
    let paymentget, totalpaymenttmodal, totalPages;
    if (search === "") {

      const skip = (page - 1) * limit;
      totalpaymenttmodal = await Payment.countDocuments();
      paymentget = await Payment.find({})
        .populate({
          path: "userId",
          select: "username",
        }).populate({
          path: "booking_id",
          select: "package_name , booking_id",
        })
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit);
      totalPages = Math.ceil(totalpaymenttmodal / limit);
    }
    else {
      paymentget = await PaymentFilter(search);
      totalPages = 1;
      totalpaymenttmodal = paymentget;
    }
    res.status(200).json({
      data: {
        payment: paymentget,
        totalpaymenttmodal: totalpaymenttmodal,
        totalPages: totalPages,
        currentPage: page,
        perPage: limit,
        nextPage: page < totalPages ? page + 1 : null,
        previousPage: page > 1 ? page - 1 : null,
      },
      msg: "Payment Get",
    });
  } catch (error) {
    res.status(500).json({
      msg: "Failed to fetch Payment get",
      error: error.message,
    });
  }
});

exports.PaymentSuccess = catchAsync(async (req, res) => {
  try {
    const { srNo } = req.params;
    if (!srNo) {
      return res.status(400).json({
        message: "srNo is required.",
        status: false,
      });
    }
    const data = await Payment.findOne({ srNo: srNo }).populate({
      path: "booking_id",
      model: 'Booking'
    });
    const userDetail = await User.findById(data?.userId);
    if (!userDetail) {
      return res.status(404).json({
        status: false,
        message: "User not found.",
      });
    }
    if (!data) {
      return res.status(404).json({
        message: "Data not found",
        status: false,
      });
    }
    data.payment_status = "success";
    await data.save();
    const Payment_ID = await fetchPaymentId(data?.session_id, srNo, "success");

    const subject = "Booking confirmed Successfully!";
    await sendEmail({
      email: userDetail.email,
      name: userDetail.username?.split(' ')?.map(word => word?.charAt(0)?.toUpperCase() + word?.slice(1)?.toLowerCase())?.join(' '),
      package: data, // Pass the saved record
      payment_id: Payment_ID,
      message: "Your booking request was successful!",
      subject: subject,
      emailTemplate: emailTemplate,
    });
    res.status(200).json({
      message: `Payment status updated`,
      status: true,
      data: data,
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    logger.error("Error updating booking status:", error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
});

exports.PaymentCancel = catchAsync(async (req, res) => {
  try {
    const { srNo } = req.params;
    if (!srNo) {
      return res.status(400).json({
        message: "srNo is required.",
        status: false,
      });
    }
    const data = await Payment.findOne({ srNo: srNo });
    if (!data) {
      return res.status(404).json({
        message: "Data not found",
        status: false,
      });
    }
    data.payment_status = "failed";
    await data.save();
    fetchPaymentId(data?.session_id, srNo, "cancel");
    res.status(200).json({
      message: `Payment status updated`,
      status: true,
      data: data,
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    logger.error("Error updating booking status:", error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
});

exports.PaymentGetByID = catchAsync(async (req, res) => {
  try {
    const { booking_id } = req.params;
    if (!booking_id) {
      return res.status(400).json({
        message: "Booking ID is required.",
        status: false,
      });
    }

    const data = await Payment.findOne({ booking_id: booking_id });

    if (!data) {
      return res.status(202).json({
        message: "Data not found",
        status: true,
        payment: false,
      });
    }
    if (data?.payment_status === "success") {
      return res.status(202).json({
        message: "Payment not done successfully",
        status: true,
        payment: true,
      });
    }

    return res.status(202).json({
      message: "Data Found",
      status: true,
      payment: false,
    });

  } catch (error) {
    console.error("Error finding payment status:", error);
    logger.error("Error finding payment status:", error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
});

exports.PackagegetByBookingId = catchAsync(async (req, res, next) => {
  try {
    // Extract `booking_id` from query parameters
    const { booking_id } = req.query;

    if (!booking_id) {
      return res.status(400).json({
        status: false,
        message: "Booking ID is required.",
      });
    }

    // Fetch the package record associated with the booking ID
    const packageRecord = await Payment.findOne({ booking_id }); // Ensure the `booking_id` field exists in your schema

    if (!packageRecord) {
      return res.status(404).json({
        status: false,
        message: "Package not found for the provided booking ID.",
      });
    }

    res.status(200).json({
      status: true,
      data: packageRecord,
      message: `Package data retrieved successfully.`,
    });
  } catch (error) {
    console.error("Error retrieving package record:", error);
    logger.error("Error retrieving package record:", error);

    res.status(500).json({
      status: false,
      message: "An error occurred while retrieving the package data. Please try again later.",
      error: error.message,
    });
  }
});
