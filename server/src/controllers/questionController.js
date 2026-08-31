const Question = require("../models/Question.js");
const Exam = require("../models/Exam.js");

const createQuestion = async (req, res) => {
  try {
    const { examId, question, options, correctAnswer } = req.body;

    // Validate required fields
    if (!examId || !question || !options || !correctAnswer) {
      return res.status(400).json({
        success: false,
        message: "Exam, question, options and correct answer are required",
      });
    }

    // Validate all four options
    if (!options.A || !options.B || !options.C || !options.D) {
      return res.status(400).json({
        success: false,
        message: "All four options (A, B, C and D) are required",
      });
    }

    // Validate correct answer
    if (!["A", "B", "C", "D"].includes(correctAnswer)) {
      return res.status(400).json({
        success: false,
        message: "Correct answer must be A, B, C or D",
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

    // Create question
    const newQuestion = await Question.create({
      examId,
      question: question.trim(),
      options: {
        A: options.A.trim(),
        B: options.B.trim(),
        C: options.C.trim(),
        D: options.D.trim(),
      },
      correctAnswer,
    });

    const populatedQuestion = await Question.findById(newQuestion._id).populate(
      "examId",
      "title slug",
    );

    return res.status(201).json({
      success: true,
      message: "Question created successfully",
      question: populatedQuestion,
    });
  } catch (error) {
    console.error("Create question error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating question",
    });
  }
};

// const getQuestions = async (req, res) => {
//   try {
//     const { examId } = req.query;

//     const filter = {};

//     if (examId) {
//       filter.examId = examId;
//     }

//     const questions = await Question.find(filter)
//       .populate("examId", "title slug")
//       .sort({
//         createdAt: -1,
//       });

//     return res.status(200).json({
//       success: true,
//       count: questions.length,
//       questions,
//     });
//   } catch (error) {
//     console.error("Get questions error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong while fetching questions",
//     });
//   }
// };

const getQuestions = async (req, res) => {
  try {
    const { examId, page = 1, limit = 10 } = req.query;

    const currentPage = Math.max(Number(page) || 1, 1);
    const perPage = Math.min(Math.max(Number(limit) || 10, 1), 100);

    const skip = (currentPage - 1) * perPage;

    // Build filter
    const filter = {};

    if (examId) {
      filter.examId = examId;
    }

    // Get total matching questions
    const total = await Question.countDocuments(filter);

    // Get paginated questions
    const questions = await Question.find(filter)
      .populate("examId", "title slug")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(perPage);

    const totalPages = Math.ceil(total / perPage);

    return res.status(200).json({
      success: true,
      questions,
      pagination: {
        page: currentPage,
        limit: perPage,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Get questions error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching questions",
    });
  }
};
const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id).populate(
      "examId",
      "title slug",
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    return res.status(200).json({
      success: true,
      question,
    });
  } catch (error) {
    console.error("Get question error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching question",
    });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const { examId, question, options, correctAnswer } = req.body;

    const existingQuestion = await Question.findById(id);

    if (!existingQuestion) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // If examId is being changed, verify the new exam exists
    if (examId !== undefined) {
      const exam = await Exam.findById(examId);

      if (!exam) {
        return res.status(404).json({
          success: false,
          message: "Exam not found",
        });
      }

      existingQuestion.examId = examId;
    }

    // Update question text
    if (question !== undefined) {
      if (!question.trim()) {
        return res.status(400).json({
          success: false,
          message: "Question cannot be empty",
        });
      }

      existingQuestion.question = question.trim();
    }

    // Update options
    if (options !== undefined) {
      if (!options.A || !options.B || !options.C || !options.D) {
        return res.status(400).json({
          success: false,
          message: "All four options (A, B, C and D) are required",
        });
      }

      existingQuestion.options = {
        A: options.A.trim(),
        B: options.B.trim(),
        C: options.C.trim(),
        D: options.D.trim(),
      };
    }

    // Update correct answer
    if (correctAnswer !== undefined) {
      if (!["A", "B", "C", "D"].includes(correctAnswer)) {
        return res.status(400).json({
          success: false,
          message: "Correct answer must be A, B, C or D",
        });
      }

      existingQuestion.correctAnswer = correctAnswer;
    }

    await existingQuestion.save();

    const updatedQuestion = await Question.findById(
      existingQuestion._id,
    ).populate("examId", "title slug");

    return res.status(200).json({
      success: true,
      message: "Question updated successfully",
      question: updatedQuestion,
    });
  } catch (error) {
    console.error("Update question error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating question",
    });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    await question.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error("Delete question error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting question",
    });
  }
};

module.exports = {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};
