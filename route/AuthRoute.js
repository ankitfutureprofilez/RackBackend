const Express = require("express")
const AuthRouter = Express.Router();
const { signup, login, resetpassword, UserGet, updateUserStatus, UserListIdDelete, profilegettoken, UserUpdate, forgotlinkrecord, forgotpassword, verifyToken } = require("../controller/AuthController");
const {checkPermission} = require('../middleware/rbacMiddleware');
AuthRouter.post("/signup", signup);

AuthRouter.post("/login", login);

AuthRouter.post("/reset/password", resetpassword);

AuthRouter.get("/profile-get", UserGet);

AuthRouter.put("/update-status", updateUserStatus);

AuthRouter.delete("/delete-user", UserListIdDelete);

AuthRouter.get("/user-get", verifyToken, profilegettoken);

AuthRouter.put("/update-user", UserUpdate);

AuthRouter.post("/forget-user", forgotlinkrecord);

AuthRouter.post("/forget-password", forgotpassword);

AuthRouter.get("/check",verifyToken, checkPermission('view_record'), UserGet);


module.exports = AuthRouter