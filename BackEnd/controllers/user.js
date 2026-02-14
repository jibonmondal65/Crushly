const User = require("../models/user");
const sendEmail = require("../utils/sendMail");
const  generateOTP  = require("../utils/generateOTP");
const {resolvePendingCrushes} = require("./HelperFunctions/afterSingup");

const userSignup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const otp = generateOTP();

    await User.create({
      firstName,
      lastName,
      email,
      password,
      emailOTP: otp,
      emailOTPExpiry: Date.now() + 10 * 60 * 1000,
      isEmailVerified: false,
    });

    await sendEmail(email, otp);

    return res.status(201).json({
      message: "OTP sent to your email",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Registration failed" });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const receivedOTP = String(otp);
    const storedOTP = String(user.emailOTP);

    if (receivedOTP !== storedOTP) {
      return res.status(400).json({
        message: "Incorrect OTP",
      });
    }

    if (user.emailOTPExpiry < Date.now()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    user.isEmailVerified = true;
    user.emailOTP = null;
    user.emailOTPExpiry = null;

    await user.save();

    await resolvePendingCrushes(user);

    return res.json({
      message: "Email verified successfully 🎉",
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Verification failed",
    });
  }
};



const userSignin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(403).json({
        message: "Please Register first",
      });
    }
    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email first",
      });
    }

    const token = await User.matchPasswordAndGenerateToken(
      req.body.email,
      req.body.password
    );

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
         secure: true,
        sameSite: "none",
        path: "/",
      })
      .json({
        user: {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
        },
      });
  } catch {
    return res.status(401).json({ message: "Invalid email or password" });
  }
};

const userLogout = (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.json({ message: "Logged out" });
};

const getUserProfile = (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  return res.json({
    user: {
      _id: req.user._id,
      email: req.user.email,
      firstName: req.user.firstName,
    },
  });
};

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const otp = generateOTP();

  user.emailOTP = otp;
  user.emailOTPExpiry = Date.now() + 10 * 60 * 1000;
  await user.save();

  await sendEmail(email, otp);

  res.json({
    message: "OTP sent to your email",
  });
};

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (
    user.emailOTP !== otp ||
    user.emailOTPExpiry < Date.now()
  ) {
    return res.status(400).json({
      message: "Invalid or expired OTP",
    });
  }

  user.password = newPassword; //pre-save will hash this
  user.emailOTP = null;
  user.emailOTPExpiry = null;

  await user.save();

  res.json({
    message: "Password reset successful ",
  });
};


module.exports = {
  userSignup,
  verifyOTP,
  userSignin,
  userLogout,
  getUserProfile,
  resetPassword,
  requestPasswordReset,
};
