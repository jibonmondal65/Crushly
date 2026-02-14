const { Router } = require("express");
const { userSignup, userSignin, userLogout, getUserProfile, verifyOTP, requestPasswordReset, resetPassword } = require("../controllers/user");
const { checkForAuthenticationCookie } = require("../middlewares/authentication");

const userRouter = Router();


userRouter.post("/register", userSignup);
userRouter.post("/verify-otp", verifyOTP);

userRouter.post("/login", userSignin);

userRouter.get("/me", checkForAuthenticationCookie("token"), getUserProfile);

userRouter.post("/logout", userLogout);

userRouter.post("/forgot-password", requestPasswordReset);
userRouter.post("/reset-password", resetPassword);


module.exports = userRouter;
