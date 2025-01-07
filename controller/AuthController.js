const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const User = require("../model/AuthModal");
const { promisify } = require("util");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const ForgetPassword = require("../emailTemplates/ForgetPassword");
const { validationErrorResponse, errorResponse, successResponse } = require("../utils/ErrorHandling");
const logger = require("../utils/Logger");

exports.verifyToken = async (req, res, next) => {
  try {
    // Fetch the Authorization header
    let authHeader = req.headers.authorization || req.headers.Authorization;
    // Check if the header exists and starts with "Bearer"
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(400).json({
        status: false,
        message: "Token is missing or malformed",
      });
    }

    // Extract the token
    let token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(400).json({
        status: false,
        message: "Token is missing",
      });
    }

    // Verify the token
    const decode = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET_KEY
    );

    if (!decode) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized or invalid token",
      });
    }

    // Check the user in the database
    const user = await User.findById(decode.id);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    // Attach user to request object and proceed
    req.User = user;
    next();
  } catch (err) {
    return res.status(401).json({
      status: false,
      message: "Invalid or expired token",
      error: err.message,
    });
  }
};


const signToken = async (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "14400m",
  });
  return token;
};

const signEmail = async (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "15m",
  });
  return token;
};




exports.signup = catchAsync(async (req, res) => {
  try {
    const { username, name, email, password, phone_number, role } = req.body;
    if (!password || !phone_number || !username || !email || !name || !role) {
      logger.error({
        message: 'All fields are required',
      });
      return validationErrorResponse(res, 'All fields are required');
    }
    const existingUser = await User.findOne({ $or: [{ email }, { phone_number }] });
    if (existingUser) {
      const errors = {};
      if (existingUser.email === email) {
        errors.email = 'Email is already in use!';
      }
      if (existingUser.phone_number === phone_number) {
        errors.phone_number = 'Phone number is already in use!';
      }
      logger.error(errors)
      return errorResponse(res, 'Email or phone number already exists', errors);
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const record = new User({
      username, name, email, phone_number, role,
      password: hashedPassword,
    });

    const result = await record.save();

    return successResponse(res, "SucessFully Signup", 200);

  } catch (error) {
    return errorResponse(res, error.message || "Internal Server Error", 500);
  }
});




exports.login = catchAsync(async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      logger.error({
        message: 'Email and password are required',
      });
      return validationErrorResponse(res, 'Email and password are required!');
    }
    const user = await User.findOne({ email });

    if (!user) {
      logger.error({ message: "Invalid Email or password", })
      return validationErrorResponse(res, 'Invalid Email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      logger.error("Incorrect password. Please try again.")
      return validationErrorResponse(res, 'Incorrect password. Please try again.');
    }

    if (user.user_status === "inactive") {
      logger.error({ message: "Your account is inactive. Please contact support.", })
      return validationErrorResponse(res, 'Your account is inactive. Please contact support.');
    }

    // if (!user.verified) {
    //   logger.error({message : "Your account is not verified. Please verify it.",})
    //   return res.status(403).json({
    //     status: false,
    //     message: "Your account is not verified. Please verify it.",
    //   });
    // }
    if (role !== "user") {
      logger.error("Access denied. Only user can log in.")
      return validationErrorResponse(res, 'Access denied. Only user can log in.');
    }
    const token = await signToken(user._id);
    return successResponse(res, "Login Successfully!", token, 200);

  } catch (error) {
    logger.error(error)
    return errorResponse(res, error || "Internal Server Error", 500);
  }
});



exports.resetpassword = catchAsync(async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return validationErrorResponse(res, 'User not found');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();
    return successResponse(res, "Password has been reset successfully!");
  } catch (error) {
    logger.error(error)
    return errorResponse(res, error || "Internal Server Error", 500);
  }
});

exports.UserGet = catchAsync(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const search = req.query.search || "";
    let userData, totalPages, totaluser;
    const filter = { role: "user", isDeleted: false };
    const skip = (page - 1) * limit;
    const users = await User.find(filter)
      .select("-password")
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);
    if (search === "") {
      const skip = (page - 1) * limit;
      totaluser = await User.countDocuments();
      userData = await User.find(filter)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
      totalPages = Math.ceil(totaluser / limit);
    }
    else {
      userData = await filterUsers(search);
      totalPages = 1;
      totaluser = userData;
    }
    const responseData = {
      userData: userData,
      totaluser: totaluser,
      totalPages: totalPages,
      currentPage: page,
      perPage: limit,
      nextPage: page < totalPages ? page + 1 : null,
      previousPage: page > 1 ? page - 1 : null,
    };

    return successResponse(res, "User data fetched successfully", responseData);
  } catch (error) {
    logger.error(error)
    return errorResponse(res, error || "Internal Server Error", 500);
  }
});


exports.updateUserStatus = catchAsync(async (req, res) => {
  try {
    const { _id, user_status } = req.body;
    if (!_id || !user_status) {
      logger.warn({ message: 'User ID and status are required', });
      return validationErrorResponse(res, 'User ID and status are required.');
    }
    const user = await User.findById(_id);
    if (!user) {
      return validationErrorResponse(res, { user: 'User not found.' });
    }
    const newStatus = user.user_status === "active" ? "inactive" : "active";
    user.user_status = newStatus;
    await user.save();
    return successResponse(res, `User status updated to ${user?.user_status}`, user, 200);

  } catch (error) {
    logger.error(error);
    return errorResponse(res, error || "Internal Server Error", 500);
  }
});


exports.UserListIdDelete = catchAsync(async (req, res) => {
  try {
    const { Id } = req.body;
    if (!Id) {
      logger.warn({ message: "User ID is required.", })
      return validationErrorResponse(res, { Id: 'User ID is required' });
    }
    const record = await User.findOneAndUpdate(
      { _id: Id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!record) {
      return errorResponse(res, 'User not found or already deleted.', record);
    }
    return successResponse(res, "User deleted successfully.", record, 200)
  } catch (error) {
    console.error("Error deleting user record:", error);
    logger.error("Error deleting user record:", error);
    return errorResponse(res, 'Internal Server Error. Please try again later.', errors);
  }
});



exports.profilegettoken = catchAsync(async (req, res) => {
  try {
    const userId = req?.User?._id;

    if (!userId) {
      logger.warn("User is not authorized or Token is missing")
      return validationErrorResponse(res, "User is not authorized or Token is missing")
    }

    const userprofile = await User.findById(userId).select('-password');
    if (!userprofile) {
      logger.error("User profile not found")
      return errorResponse(res, "User profile not found")
    }

    successResponse(res, "Profile retrieved successfully", userprofile, 200)
  } catch (error) {
    logger.error(error)
    errorResponse(res, "Failed to fetch profile", error.message,)
  }
});

exports.UserUpdate = catchAsync(async (req, res) => {
  try {
    console.log("req.body", req.body)
    const { Id, username, name, email, password, phone_number, role } = req.body;
    if (!Id) {
      logger.warn({ message: 'User ID is required', });
      return validationErrorResponse(res, { Id: 'User ID is required' });
    }
    const updatedRecord = await User.findByIdAndUpdate(
      Id,
      { username, name, email, password, phone_number, role },
      { new: true, runValidators: true }
    );

    if (!updatedRecord) {
      logger.error("User not found:");
      return validationErrorResponse(res, "User not found:")
    }
    successResponse(res, "User updated successfully.", updatedRecord, 200)
  } catch (error) {
    logger.error("Error updating User record:", error);
    errorResponse(res, "An error occurred while updating the User. Please try again later.", error.message)
  }
});

exports.forgotlinkrecord = catchAsync(async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return validationErrorResponse(res, { email: 'Email is required' });
    }
    const record = await User.findOne({ email: email });
    if (!record) {
      return errorResponse(res, "No user found with this email", 404);
    }
    const token = await signEmail(record._id);
    const resetLink = `https://user-event.vercel.app/forgotpassword/${token}`;
    const customerUser = record.username;
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST, port: process.env.MAIL_PORT, secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const emailHtml = ForgetPassword(resetLink, customerUser);
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: record.email,
      subject: "Reset Your Password",
      html: emailHtml,
    });


    return successResponse(res, "Email has been sent to your registered email");

  } catch (error) {
    console.error("Error in forgot password process:", error);
    logger.error("Error in forgot password process:", error);
    return errorResponse(res, "Failed to send email");
  }
}
);

exports.forgotpassword = catchAsync(
  async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findById(decoded.id);
      if (!user) {
        return errorResponse(res, "User not found", 404);
      }
      user.password = await bcrypt.hash(newPassword, 12);
      await user.save();
      return successResponse(res, "Password has been successfully reset");
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return errorResponse(res, "Token has expired. Please generate a new token.", 401);
      }
      console.error("Error in password reset process:", error);
      logger.error("Error in password reset process:", error);
      return errorResponse(res, "Failed to reset password");
    }
  }
);
