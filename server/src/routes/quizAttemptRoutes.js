const express = require("express");

const {
  submitQuizAttempt,
  getMyQuizAttempts,
  getMyQuizAttemptById,
} = require("../controllers/quizAttemptController.js");

const { protect } = require("../middlewares/authMiddleware.js");

const router = express.Router();

// All quiz attempt routes require authentication
router.use(protect);

// Submit a quiz
router.post("/", submitQuizAttempt);

// Get logged-in user's quiz history
router.get("/my", getMyQuizAttempts);

// Get one specific attempt
router.get("/my/:id", getMyQuizAttemptById);

module.exports = router;
