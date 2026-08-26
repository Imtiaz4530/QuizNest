const QuizAttempt = require("../models/QuizAttempt.js");
const Exam = require("../models/Exam.js");
const Question = require("../models/Question.js");

const getMyQuizAttempts = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({
      userId: req.user._id,
    })
      .populate("examId", "title slug")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: attempts.length,
      attempts,
    });
  } catch (error) {
    console.error("Get quiz attempts error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching quiz attempts",
    });
  }
};

const getMyQuizAttemptById = async (req, res) => {
  try {
    const { id } = req.params;

    const attempt = await QuizAttempt.findOne({
      _id: id,
      userId: req.user._id,
    })
      .populate("examId", "title slug")
      .populate("answers.questionId", "question options correctAnswer");

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Quiz attempt not found",
      });
    }

    return res.status(200).json({
      success: true,
      attempt,
    });
  } catch (error) {
    console.error("Get quiz attempt error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching quiz attempt",
    });
  }
};

module.exports = {
  getMyQuizAttempts,
  getMyQuizAttemptById,
};
