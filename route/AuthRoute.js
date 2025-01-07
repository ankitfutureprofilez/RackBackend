const Express = require("express")
const AuthRouter = Express.Router();
const { signup, login, resetpassword, UserGet, updateUserStatus, UserListIdDelete, verifyToken, profilegettoken, UserUpdate } = require("../controller/AuthController");

AuthRouter.post("/signup", signup);

AuthRouter.post("/login", login);

AuthRouter.post("/reset/password", resetpassword);

AuthRouter.get("/profile-get", UserGet);

AuthRouter.put("/update-status", updateUserStatus);

AuthRouter.delete("/delete-user", UserListIdDelete);

AuthRouter.get("/user-get", verifyToken, profilegettoken);

AuthRouter.put("/update-user", UserUpdate);

module.exports = AuthRouter