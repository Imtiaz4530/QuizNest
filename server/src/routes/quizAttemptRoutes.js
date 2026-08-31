const express = require("express");

const {
  getMyQuizAttempts,
  getMyQuizAttemptById,
  getAllQuizAttempts,
} = require("../controllers/quizAttemptController.js");

const { protect, adminOnly } = require("../middlewares/authMiddleware.js");

const router = express.Router();

// All quiz attempt routes require authentication
router.use(protect);

// Get logged-in user's quiz history
router.get("/my", getMyQuizAttempts);

// Get one specific attempt
router.get("/my/:id", getMyQuizAttemptById);

// adminOnly
router.get("/", protect, adminOnly, getAllQuizAttempts);

module.exports = router;
