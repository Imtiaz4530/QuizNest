const express = require("express");
const {
  registerUser,
  loginUser,
  loginAdmin,
  getUsers,
  getUserById,
  updateUserByAdmin,
} = require("../controllers/userController.js");

const { adminOnly, protect } = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);

// admin
router.post("/auth/admin/login", loginAdmin);

router.get("/", protect, adminOnly, getUsers);
router.get("/:id", protect, adminOnly, getUserById);
router.patch("/:id", protect, adminOnly, updateUserByAdmin);

module.exports = router;
