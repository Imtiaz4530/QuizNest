const express = require("express");
const {
  registerUser,
  loginUser,
  loginAdmin,
  getUsers,
} = require("../controllers/userController.js");

const { adminOnly, protect } = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);

// admin
router.post("/auth/admin/login", loginAdmin);

router.get("/", protect, adminOnly, getUsers);

module.exports = router;
