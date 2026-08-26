const express = require("express");

const {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
} = require("../controllers/examController.js");

const { protect, adminOnly } = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.post("/", protect, adminOnly, createExam);
router.get("/", getExams);
router.get("/:id", getExamById);
router.patch("/:id", protect, adminOnly, updateExam);
router.delete("/:id", protect, adminOnly, deleteExam);

module.exports = router;
