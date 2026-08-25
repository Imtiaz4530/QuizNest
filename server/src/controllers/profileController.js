const Profile = require("../models/Profile.js");

const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      userId: req.user._id,
    }).populate("userId", "name email role avatar");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching profile",
    });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const {
      gender,
      dateOfBirth,
      phone,
      bio,
      educationLevel,
      group,
      examPreferences,
      socialLinks,
    } = req.body;

    const profile = await Profile.findOne({
      userId: req.user._id,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    // Update only fields that were provided
    if (gender !== undefined) {
      profile.gender = gender;
    }

    if (dateOfBirth !== undefined) {
      profile.dateOfBirth = dateOfBirth;
    }

    if (phone !== undefined) {
      profile.phone = "880" + phone;
    }

    if (bio !== undefined) {
      profile.bio = bio;
    }

    if (educationLevel !== undefined) {
      profile.educationLevel = educationLevel;
    }

    if (group !== undefined) {
      profile.group = group;
    }

    if (examPreferences !== undefined) {
      profile.examPreferences = examPreferences;
    }

    if (socialLinks !== undefined) {
      profile.socialLinks = {
        ...profile.socialLinks,
        ...socialLinks,
      };
    }

    await profile.save();

    const updatedProfile = await Profile.findById(profile._id).populate(
      "userId",
      "name email role avatar",
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating profile",
    });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
};
