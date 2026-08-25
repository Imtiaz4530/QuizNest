const express = require("express");

const {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/questionController.js");

const { adminOnly, protect } = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.post("/", protect, adminOnly, createQuestion);
router.get("/", protect, getQuestions);
router.get("/:id", protect, getQuestionById);
router.patch("/:id", protect, adminOnly, updateQuestion);
router.delete("/:id", protect, adminOnly, deleteQuestion);

module.exports = router;
