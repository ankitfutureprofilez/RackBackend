const Booking = require("../model/Booking");
const User = require("../model/User");
const catchAsync = require("../utils/catchAsync");
const sendEmail = require("../utils/EmailMailler");
const emailTemplate = require("../emailTemplates/Booking");
const PaymentLink = require("../emailTemplates/PaymentLink");
const nodemailer = require("nodemailer");
const { default: axios } = require("axios");
const payment = require("../model/payment");
const { errorResponse, successResponse } = require("../utils/ErrorHandling");
const logger = require("../utils/Logger");
const BookingFilter = async (name) => {
  try {
    if (!name) {
      return res.status(400).json({
        status: false,
        message: "Name is required for filtering bookings.",
      });
    }
    const matchingUserIds = await User.find({
      username: { $regex: name, $options: "i" }
    }).distinct("_id");
    const bookings = await Booking.find({
      $or: [
        { package_name: { $regex: name, $options: "i" } },
        { userId: { $in: matchingUserIds } },
      ],
    }).populate({
      path: "userId",
      select: "username email",
    });
    return bookings;
  } catch (error) {
    console.error("Error fetching booking:", error);
    logger.error("Error fetching booking:", error);
    return res.status(500).json({
      status: false,
      message: "An error occurred while fetching bookings.",
      error: error.message,
    });
  }
};

exports.bookingpost = catchAsync(async (req, res) => {
  const userId = req?.User?._id;

  // Validate User ID
  if (!userId) {
    return res.status(400).json({
      status: false,
      message: "User information not found in the request or userId is undefined.",
    });
  }
  // Destructure request body
  const {
    Package,
    CurrencyCode,
    package_name,
    bookingDate,
    location,
    status,
    attendees,
    package_data,
    totalPrice,
    formData,
  } = req.body;

  try {
    // Create the booking record
    const record = new Booking({
      formData: formData,
      package: Package,
      package_name,
      bookingDate,
      location,
      status,
      CurrencyCode,
      package_data,
      userId,
      attendees,
      totalPrice,
    });

    const userDetail = await User.findById(userId);
    if (!userDetail) {
      return res.status(404).json({
        status: false,
        message: "User not found.",
      });
    }
    const data = await record.save();
    const subject = "Thank You! Your Booking Request Is Successful";
    await sendEmail({
      email: process.env.Admin_Email,
      name: userDetail.username?.split(' ')?.map(word => word?.charAt(0)?.toUpperCase() + word?.slice(1)?.toLowerCase())?.join(' '),
      package: data,
      message: "Your booking request was successful!",
      subject: subject,
      emailTemplate: emailTemplate,
    });
    await sendEmail({
      email: userDetail.email,
      name: userDetail.username?.split(' ')?.map(word => word?.charAt(0)?.toUpperCase() + word?.slice(1)?.toLowerCase())?.join(' '),
      package: data, // Pass the saved record
      message: "Your booking request was successful!",
      subject: subject,
      emailTemplate: emailTemplate,
    });

    // Saving data only if email is sent successfully 

    return res.status(201).json({
      status: true,
      message: "Booking successfully created!",
      data: record,
    });

  } catch (error) {
    console.error("Error during booking creation:", error);
    logger.error("Error during booking creation:", error);
    return res.status(500).json({
      status: false,
      message: "An error occurred while creating the booking.",
      error: error.message,
    });
  }

});


exports.BookingGet = catchAsync(async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const search = req.query.search || "";
    let BookingData, totalPages, totalBooking;
    if (search === "") {
      const skip = (page - 1) * limit;
      totalBooking = await Booking.countDocuments();
      BookingData = await Booking.find({})
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "userId",
          select: "username email",
          //  model: 'User'
        });
      totalPages = Math.ceil(totalBooking / limit);
    }
    else {
      BookingData = await BookingFilter(search);
      totalPages = 1;
      totalBooking = BookingData;
    }
    res.status(200).json({
      data: {
        bookingdata: BookingData,
        totalBooking: totalBooking,
        totalPages: totalPages,
        currentPage: page,
        perPage: limit,
        nextPage: page < totalPages ? page + 1 : null,
        previousPage: page > 1 ? page - 1 : null,
      },
      msg: "Contact Get",
    });
  } catch (error) {
    res.status(500).json({
      msg: "Failed to fetch Contact get",
      error: error.message,
    });
  }
});

exports.BookingStatus = catchAsync(async (req, res) => {
  try {

    const { _id, status, attendees } = req.body;

    // Check if all required fields are provided
    if (!_id || !status || !attendees) {
      return res.status(400).json({
        message: "Booking ID, status, attendees are required.",
        status: false,
      });
    }

    // Find the booking by ID
    const bookingstatus = await Booking.findById(_id);

    if (!bookingstatus) {
      return res.status(404).json({
        message: "Booking not found",
        status: false,
      });
    }

    // Update the status
    bookingstatus.status = status;
    // Update the attendees
    bookingstatus.attendees = attendees;
    // Save the updated document
    await bookingstatus.save();

    // Respond with success message
    res.status(200).json({
      message: `Booking updated `,
      status: true,
      data: bookingstatus,
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    logger.error("Error updating booking status:", error);

    // Respond with an error message
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
});


exports.BookingPayment = catchAsync(async (req, res) => {
  try {
    const { _id, payment_genrator_link, totalPrice, payment_genrator_date, AdminCurrencyCode } = req.body;
    if (!_id) {
      return res.status(400).json({
        message: "Booking ID is required.",
        status: false,
      });
    }
    const user_currency_rate = req.user_currency_rate;
    const adminCurrencyRate = req.adminCurrencyRate;
    const updatedRecord = await Booking.findByIdAndUpdate(
      _id,
      { payment_genrator_link, totalPrice, payment_genrator_date, user_currency_rate, adminCurrencyRate, AdminCurrencyCode },
      { new: true, runValidators: true }
    );

    const bookingstatus = await Booking.findById(_id).populate({
      path: "userId",
      select: "username email",
    });
    const paymentdata = await payment.findOne({ booking_id: _id });
    const paymentLink = `https://user-event.vercel.app/payment/${bookingstatus?._id}`;
    const currencyCode = bookingstatus?.AdminCurrencyCode || 'USD';
    const emailHtml = PaymentLink(paymentLink, bookingstatus?.userId?.username, bookingstatus?.totalPrice * adminCurrencyRate, currencyCode);
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: bookingstatus.userId?.email,
      subject: "Payment Link to confirm your Booking",
      html: emailHtml,
    });

    // Return a success response
    return successResponse(res, "Payment link sent successfully!");
  } catch (error) {
    console.error("Error updating booking status:", error);
    logger.error("Error updating booking status:", error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
});

exports.BookingPrice = catchAsync(async (req, res) => {
  try {
    const { _id, place_id, price, totalPrice, currency, attendens, User_totalprice } = req.body;

    // Validate input data
    if (!_id || !place_id || !price) {
      return res.status(400).json({
        message: "Package ID, place ID, and price are required.",
        status: false,
      });
    }

    // Find the package by its ID
    const packageData = await Booking.findById(_id);

    if (!packageData) {
      return res.status(404).json({
        message: "Package not found",
        status: false,
      });
    }

    packageData.totalPrice = totalPrice;
    packageData.User_totalprice = User_totalprice,
      packageData.CurrencyCode = currency;
    packageData.attendees = attendens;
    const serviceIndex = packageData.package.findIndex(
      (service) => service.place_id === place_id || service.place_id === place_id.toString()
    );

    if (serviceIndex === -1) {
      return res.status(404).json({
        message: "Service with the given place ID not found",
        status: false,
      });
    }

    // Update the specific service
    const service = packageData.package[serviceIndex];
    let isUpdated = false;

    if (service.services_provider_price !== undefined) {
      service.services_provider_price = price;
      isUpdated = true;
    }
    if (service.price_level !== undefined) {
      service.price_level = price;
      isUpdated = true;
    }
    if (!isUpdated) {
      // If neither services_provider_price nor price_level exists, add price_level
      service.price_level = price;
      isUpdated = true;
    }
    if (isUpdated) {
      // Mark the `package` array as modified
      packageData.markModified("package");
      // Save the updated document
      const updatedPackage = await packageData.save();

      return res.status(200).json({
        message: "Service price updated successfully",
        status: true,
        data: updatedPackage,
      });
    }
  } catch (error) {
    console.error("Error updating service price:", error);
    logger.error("Error updating service price:", error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
});

exports.BookingGetByID = catchAsync(async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "Booking ID is required.",
        status: false,
      });
    }

    const booking = await Booking.findById(id).populate({
      path: "userId",
      select: "username email phone_number phone_code",
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
        status: false,
      });
    }
    const paymentdata = await payment.findOne({ booking_id: id });

    const fetchPlaceDetails = async (placeId) => {
      try {
        const API_KEY = process.env.GOOGLE_MAPS_API_KEY; // Google API key
        const placeUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${API_KEY}`;
        const placeResponse = await axios.get(placeUrl);

        if (placeResponse.data.status !== 'OK') {
          throw new Error(placeResponse.data.error_message || 'Failed to fetch place details');
        }
        const placeDetails = placeResponse.data.result;
        const photoUrls = placeDetails.photos ? placeDetails.photos.map(photo => {
          return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${API_KEY}`;
        }) : [];

        placeDetails.photoUrls = photoUrls; // Add photo URLs to place details
        return placeDetails;
      } catch (error) {
        console.error("Error fetching place details:", error);
        logger.error("Error fetching place details:", error);
        return null;
      }
    };
    const updatedPackage = await Promise.all(booking?.package?.map(async (pkg) => {
      if (pkg.place_id) {
        const placeDetails = await fetchPlaceDetails(pkg.place_id);
        if (placeDetails) {
          return { ...pkg, placeDetails };
        }
      }
      return pkg;
    }));

    booking.package = updatedPackage;


    res.status(200).json({
      message: "Data retrieved successfully",
      status: true,
      data: booking,
      paymentdata: paymentdata,
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

exports.BookingPaymentId = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Payment ID is required.",
      });
    }
    // Fetch the current package record by ID
    const packageRecord = await Booking.findById(id)
    const paymentRecord = await payment.findOne({ booking_id: packageRecord._id })

    const fetchPlaceDetails = async (placeId) => {
      try {
        const API_KEY = process.env.GOOGLE_MAPS_API_KEY; // Google API key
        const placeUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${API_KEY}`;
        const placeResponse = await axios.get(placeUrl);

        if (placeResponse.data.status !== 'OK') {
          throw new Error(placeResponse.data.error_message || 'Failed to fetch place details');
        }
        const placeDetails = placeResponse.data.result;
        const photoUrls = placeDetails.photos ? placeDetails.photos.map(photo => {
          return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${API_KEY}`;
        }) : [];

        placeDetails.photoUrls = photoUrls; // Add photo URLs to place details
        return placeDetails;
      } catch (error) {
        console.error("Error fetching place details:", error);
        logger.error("Error fetching place details:", error);
        return null;
      }
    };
    const updatedPackage = await Promise.all(packageRecord.package.map(async (pkg) => {
      if (pkg?.place_id) {
        const placeDetails = await fetchPlaceDetails(pkg.place_id);
        if (placeDetails) {
          return { ...pkg, placeDetails };
        }
      }
      return pkg;
    }));

    packageRecord.package = updatedPackage;

    if (!packageRecord) {
      return res.status(404).json({
        status: false,
        message: "Booking not found!",
      });
    }

    res.status(200).json({
      status: true,
      packageRecord: packageRecord,
      data: paymentRecord,
      message: `Booking successfully.`,
    });

  } catch (error) {
    logger.error("Error updating package record:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while updating the package. Please try again later.",
      error: error.message,
    });
  }
});


exports.deleteServiceProvider = catchAsync(async (req, res) => {
  const Id = req.params.Id;
  const placeId = req.params.placeId;
  try {
    const serviceProvider = await Booking.findOne({ _id: Id });
    if (!serviceProvider) {
      return res.status(404).json(
        {
          message: 'Service provider not found',
          status: false
        }
      );
    }
    const packageExists = serviceProvider.package.some(pkg => pkg.place_id === placeId);
    if (!packageExists) {
      return res.status(404).json({
        message: 'Package not found for the service provider',
        status: false,
      });
    }
    const updatedPackage = serviceProvider.package.filter(pkg => pkg.place_id !== placeId);
    serviceProvider.package = updatedPackage;
    await serviceProvider.save();
    res.status(200).json(
      {
        message: 'Service provider deleted successfully',
        data: serviceProvider,
        status: true
      }
    );
  } catch (error) {
    logger.error("Error updating package record:", error);

    res.status(500).json({
      message: 'An error occurred while deleting the service provider',
      error: error.message,
    });
  }
}
);


exports.updateServiceProviderPackage = catchAsync(async (req, res) => {
  const { newPackageData, Id } = req.body;
  try {
    const serviceProvider = await Booking.findOne({ _id: Id });
    if (!serviceProvider) {
      return res.status(404).json({
        message: 'Service provider not found',
        status: false,
      });
    }
    serviceProvider.package.push(newPackageData);
    await serviceProvider.save();
    res.status(200).json(
      {
        message: 'Service provider package updated successfully',
        data: serviceProvider.package,
        status: true,
      }
    );
  } catch (error) {
    logger.error("Error updating package record:", error);
    res.status(500).json({
      message: 'An error occurred while updating the service provider package',
      error: error.message,
    });
  }
});
