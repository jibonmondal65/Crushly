const Profile = require("../models/profile");
const cloudinary = require("../utils/cloudinary");

const fs = require("fs");
const path = require("path");

const deleteLocalFile = (filePath) => {
  if (!filePath) return;

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Failed to delete temp file:", err);
    }
  });
};

const createOrUpdateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bio, gender } = req.body;

    let profile = await Profile.findOne({ user: userId });

    let cloudinaryResult = null;

    if (req.file) {
      //  Upload local file to Cloudinary
      cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "crushly_profiles",
      });

      //  Delete local temp file
      deleteLocalFile(req.file.path);
    }

    // UPDATE PROFILE
    if (profile) {

      if (cloudinaryResult) {

        // delete old image from cloud
        if (profile.avatarPublicId) {
          await cloudinary.uploader.destroy(profile.avatarPublicId);
        }

        profile.avatar = cloudinaryResult.secure_url;
        profile.avatarPublicId = cloudinaryResult.public_id;
      }

      profile.bio = bio;
      profile.gender = gender;
      profile.isProfileComplete = true;

      await profile.save();
      return res.json(profile);
    }

    // CREATE PROFILE
    if (!cloudinaryResult) {
      return res.status(400).json({
        message: "Profile picture is required",
      });
    }

    profile = await Profile.create({
      user: userId,
      avatar: cloudinaryResult.secure_url,
      avatarPublicId: cloudinaryResult.public_id,
      bio,
      gender,
      isProfileComplete: true,
    });

    return res.status(201).json(profile);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to save profile",
    });
  }
};




const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    return res.json(profile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch profile",
    });
  }
};

module.exports = {
  createOrUpdateProfile,
  getMyProfile,
};



