const express = require("express");

const {
  getMyProfile,
  updateMyProfile,
} = require("../controllers/profileController.js");

const { protect } = require("../middlewares/authMiddleware.js");

const router = express.Router();

// Get logged-in user's profile
router.get("/me", protect, getMyProfile);

// Update logged-in user's profile
router.patch("/me", protect, updateMyProfile);

module.exports = router;
