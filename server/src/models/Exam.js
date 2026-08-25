const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Exam title is required"],
      unique: true,
      trim: true,
      maxlength: [150, "Exam title cannot exceed 150 characters"],
    },

    slug: {
      type: String,
      required: [true, "Exam slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
      default: "",
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },

    icon: {
      type: String,
      trim: true,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isPopular: {
      type: Boolean,
      default: false,
    },

    order: {
      type: Number,
      default: 0,
      min: [0, "Order cannot be negative"],
    },
  },
  {
    timestamps: true,
  },
);

const Exam = mongoose.model("Exam", examSchema);

module.exports = Exam;
