const userRoute = require("express").Router();
const { signup, login, profile, verifyToken, updateUserStatus, resetpassword, UserListIdDelete, UserUpdate, forgotlinkrecord, forgotpassword, getCount, profilegettoken, userfilter, VerifyUser, adminlogin, OTP, VerifyOtp } = require("../controller/AuthController");

userRoute.post("/signup", signup)

userRoute.post("/otp", OTP)

userRoute.post("/otp_verifiy", VerifyOtp)

userRoute.post("/login", login)

userRoute.post("/admin/login", adminlogin)

userRoute.get("/profile", profile)

userRoute.post("/updated_status", updateUserStatus)

userRoute.post("/forgot-password", forgotlinkrecord)

userRoute.post("/forgot", forgotpassword)

userRoute.post("/reset-password", verifyToken, resetpassword)

userRoute.post("/delete", verifyToken, UserListIdDelete)

userRoute.post("/update", verifyToken, UserUpdate)

userRoute.get("/profile-token", verifyToken, profilegettoken)

// userRoute.get("/profile-token", profilegettoken)


userRoute.post("/verifyaccount", VerifyUser)




module.exports = userRoute