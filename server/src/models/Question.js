const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: [true, "Exam is required"],
    },

    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,
    },

    options: {
      A: {
        type: String,
        required: [true, "Option A is required"],
        trim: true,
      },

      B: {
        type: String,
        required: [true, "Option B is required"],
        trim: true,
      },

      C: {
        type: String,
        required: [true, "Option C is required"],
        trim: true,
      },

      D: {
        type: String,
        required: [true, "Option D is required"],
        trim: true,
      },
    },

    correctAnswer: {
      type: String,
      enum: ["A", "B", "C", "D"],
      required: [true, "Correct answer is required"],
    },
  },
  {
    timestamps: true,
  },
);

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
