const express = require("express");

const { startQuiz, submitQuiz } = require("../controllers/quizController.js");

const { protect } = require("../middlewares/authMiddleware.js");

const router = express.Router();

// All quiz routes require authentication
router.use(protect);
// Start a quiz
router.get("/:examId/start", startQuiz);
// Submit a quiz
router.post("/:examId/submit", submitQuiz);

module.exports = router;
