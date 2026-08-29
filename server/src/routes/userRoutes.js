const express = require("express");
const {
  registerUser,
  loginUser,
  loginAdmin,
} = require("../controllers/userController.js");

const router = express.Router();

router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);

// admin
router.post("/auth/admin/login", loginAdmin);

module.exports = router;
