const Profile = require("../models/profile");

const requireProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res.status(403).json({
        message: "Please complete your profile before adding a crush",
        code: "PROFILE_INCOMPLETE",
      });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: "Profile check failed" });
  }
};

module.exports = requireProfile;
