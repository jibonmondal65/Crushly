const mongoose = require("mongoose");
const User = require("./user");

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    avatar: {
      type: String,
      required: true,
    },
    avatarPublicId: {
      type: String,
    },

    bio: {
      type: String,
      maxLength: 200,
      default: "",
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    isProfilePublic: {
      type: Boolean,
      default: true,
    },

    isProfileComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;