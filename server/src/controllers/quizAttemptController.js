const QuizAttempt = require("../models/QuizAttempt.js");
const Exam = require("../models/Exam.js");
const Question = require("../models/Question.js");

const submitQuizAttempt = async (req, res) => {
  try {
    const { examId, answers } = req.body;

    if (!examId || !answers) {
      return res.status(400).json({
        success: false,
        message: "Exam ID and answers are required",
      });
    }

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Answers must be a non-empty array",
      });
    }

    // Check if exam exists
    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    // Get submitted question IDs
    const questionIds = answers.map((answer) => answer.questionId);

    // Fetch questions from database
    const questions = await Question.find({
      _id: { $in: questionIds },
      examId,
    });

    if (questions.length !== questionIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more questions are invalid for this exam",
      });
    }

    let score = 0;

    const processedAnswers = questions.map((question) => {
      const submittedAnswer = answers.find(
        (answer) => answer.questionId.toString() === question._id.toString(),
      );

      const selectedAnswer = submittedAnswer?.selectedAnswer || null;

      const isCorrect =
        selectedAnswer !== null && selectedAnswer === question.correctAnswer;

      if (isCorrect) {
        score++;
      }

      return {
        questionId: question._id,
        selectedAnswer,
        isCorrect,
      };
    });

    // Create quiz attempt
    const quizAttempt = await QuizAttempt.create({
      userId: req.user._id,
      examId,
      score,
      answers: processedAnswers,
    });

    const populatedAttempt = await QuizAttempt.findById(quizAttempt._id)
      .populate("examId", "title slug")
      .populate("userId", "name email");

    return res.status(201).json({
      success: true,
      message: "Quiz submitted successfully",
      attempt: populatedAttempt,
    });
  } catch (error) {
    console.error("Submit quiz attempt error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while submitting quiz",
    });
  }
};

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
  submitQuizAttempt,
  getMyQuizAttempts,
  getMyQuizAttemptById,
};
