const Exam = require("../models/Exam.js");
const Question = require("../models/Question.js");
const QuizAttempt = require("../models/QuizAttempt.js");

const startQuiz = async (req, res) => {
  try {
    const { examId } = req.params;

    // Check if exam exists and is active
    const exam = await Exam.findOne({
      _id: examId,
      isActive: true,
    }).populate("categoryId", "name slug");

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found or inactive",
      });
    }

    // Get all questions for this exam
    const questions = await Question.find({
      examId: exam._id,
    }).select("_id question options");

    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No questions available for this exam",
      });
    }

    // Shuffle questions
    const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);

    return res.status(200).json({
      success: true,
      exam: {
        _id: exam._id,
        title: exam.title,
        slug: exam.slug,
        description: exam.description,
        icon: exam.icon,
        categoryId: exam.categoryId,
      },
      totalQuestions: shuffledQuestions.length,
      questions: shuffledQuestions,
    });
  } catch (error) {
    console.error("Start quiz error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while starting quiz",
    });
  }
};

const submitQuiz = async (req, res) => {
  try {
    const { examId } = req.params;
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Answers must be an array",
      });
    }

    // Check if exam exists and is active
    const exam = await Exam.findOne({
      _id: examId,
      isActive: true,
    });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found or inactive",
      });
    }

    if (answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No answers submitted",
      });
    }

    // Get question IDs from submitted answers
    const questionIds = answers.map((answer) => answer.questionId);

    // Make sure there are no duplicate question IDs
    const uniqueQuestionIds = new Set(questionIds.map((id) => id.toString()));

    if (uniqueQuestionIds.size !== questionIds.length) {
      return res.status(400).json({
        success: false,
        message: "Duplicate questions are not allowed",
      });
    }

    // Get questions from database
    const questions = await Question.find({
      _id: { $in: questionIds },
      examId: exam._id,
    }).select("_id correctAnswer");

    // Make sure every submitted question belongs to this exam
    if (questions.length !== questionIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more questions are invalid for this exam",
      });
    }

    let score = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let unanswered = 0;

    const processedAnswers = questions.map((question) => {
      const submittedAnswer = answers.find(
        (answer) => answer.questionId.toString() === question._id.toString(),
      );

      const selectedAnswer = submittedAnswer?.selectedAnswer || null;

      const isCorrect =
        selectedAnswer !== null && selectedAnswer === question.correctAnswer;

      if (selectedAnswer === null) {
        unanswered++;
      } else if (isCorrect) {
        score++;
        correctAnswers++;
      } else {
        wrongAnswers++;
      }

      return {
        questionId: question._id,
        selectedAnswer,
        isCorrect,
      };
    });

    // Save attempt
    const attempt = await QuizAttempt.create({
      userId: req.user._id,
      examId: exam._id,
      score,
      answers: processedAnswers,
    });

    return res.status(201).json({
      success: true,
      message: "Quiz submitted successfully",
      result: {
        attemptId: attempt._id,
        examId: exam._id,
        score,
        totalQuestions: questions.length,
        correctAnswers,
        wrongAnswers,
        unanswered,
      },
    });
  } catch (error) {
    console.error("Submit quiz error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while submitting quiz",
    });
  }
};

module.exports = {
  startQuiz,
  submitQuiz,
};
