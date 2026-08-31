const QuizAttempt = require("../models/QuizAttempt.js");

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

const getAllQuizAttempts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const currentPage = Math.max(Number(page) || 1, 1);

    const perPage = Math.min(Math.max(Number(limit) || 20, 1), 100);

    const skip = (currentPage - 1) * perPage;

    // Get total attempts
    const total = await QuizAttempt.countDocuments();

    // Get paginated attempts
    const attempts = await QuizAttempt.find()
      .populate("userId", "name email")
      .populate("examId", "title slug")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(perPage)
      .lean();

    const totalPages = Math.ceil(total / perPage);

    return res.status(200).json({
      success: true,
      count: attempts.length,
      attempts,
      pagination: {
        page: currentPage,
        limit: perPage,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Get all quiz attempts error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching quiz attempts",
    });
  }
};

module.exports = {
  getMyQuizAttempts,
  getMyQuizAttemptById,
  getAllQuizAttempts,
};
