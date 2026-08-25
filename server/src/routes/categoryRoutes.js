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

// All category routes require admin authentication
router.use(protect, adminOnly);

router.post("/", createCategory);

router.get("/", getCategories);

router.get("/:id", getCategoryById);

router.patch("/:id", updateCategory);

router.delete("/:id", deleteCategory);

module.exports = router;
