const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male",
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    phone: {
      type: Number,
      trim: true,
      default: "",
    },

    bio: {
      type: String,
      trim: true,
      maxlength: [300, "Bio cannot exceed 300 characters"],
      default: "",
    },

    educationLevel: {
      type: String,
      enum: ["SSC", "HSC", "Undergraduate", "Graduate", "Other"],
      default: "SSC",
    },

    group: {
      type: String,
      enum: ["science", "arts", "commerce"],
      default: "science",
    },

    examPreferences: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam",
      },
    ],

    socialLinks: {
      facebook: {
        type: String,
        trim: true,
        default: "",
      },

      linkedin: {
        type: String,
        trim: true,
        default: "",
      },

      github: {
        type: String,
        trim: true,
        default: "",
      },

      website: {
        type: String,
        trim: true,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  },
);

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
