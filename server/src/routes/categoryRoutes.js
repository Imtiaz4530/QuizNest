const express = require("express");

const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController.js");

const { adminOnly, protect } = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.post("/", protect, adminOnly, createCategory);
router.get("/", protect, getCategories);
router.get("/:id", protect, getCategoryById);
router.patch("/:id", protect, adminOnly, updateCategory);
router.delete("/:id", protect, adminOnly, deleteCategory);

module.exports = router;
