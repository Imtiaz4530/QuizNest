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

router.use(protect, adminOnly);

router.post("/", createQuestion);
router.get("/", getQuestions);
router.get("/:id", getQuestionById);
router.patch("/:id", updateQuestion);
router.delete("/:id", deleteQuestion);

module.exports = router;
