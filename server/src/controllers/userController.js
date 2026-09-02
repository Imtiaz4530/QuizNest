const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User.js");
const Profile = require("../models/Profile.js");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, avatar } = req.body;

    // Validate required fields
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password and confirm password are required",
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      avatar: avatar || "",
    });

    // Create user's profile
    await Profile.create({
      userId: user._id,
    });

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      },
    );

    // Never return password
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
    };

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Register user error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while registering the user",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user and explicitly include password
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    // Don't reveal whether the email exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      },
    );

    // Never return password
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
    };

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Login user error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while logging in",
    });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find admin by email
    const admin = await User.findOne({
      email: normalizedEmail,
      role: "admin",
    }).select("+password");

    // Don't reveal whether email exists
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        userId: admin._id,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    // Never return password
    const adminResponse = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      avatar: admin.avatar,
      createdAt: admin.createdAt,
    };

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      admin: adminResponse,
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while logging in",
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      role = "",
      isActive = "",
    } = req.query;

    const currentPage = Math.max(Number(page) || 1, 1);

    const perPage = Math.min(Math.max(Number(limit) || 10, 1), 100);

    const skip = (currentPage - 1) * perPage;

    // Build filter
    const filter = {};

    // Search by name or email
    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");

      filter.$or = [
        {
          name: searchRegex,
        },
        {
          email: searchRegex,
        },
      ];
    }

    // Filter by role
    if (role) {
      if (!["user", "admin"].includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role",
        });
      }

      filter.role = role;
    }

    // Filter by active status
    if (isActive !== "") {
      if (!["true", "false"].includes(isActive)) {
        return res.status(400).json({
          success: false,
          message: "Invalid isActive value",
        });
      }

      filter.isActive = isActive === "true";
    }

    // Get total matching users
    const total = await User.countDocuments(filter);

    // Get paginated users
    const users = await User.find(filter)
      .select("-password")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(perPage);

    const totalPages = Math.ceil(total / perPage);

    return res.status(200).json({
      success: true,
      users,
      pagination: {
        page: currentPage,
        limit: perPage,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Get users error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching users",
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password").lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user by ID error:", error);

    // Invalid MongoDB ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the user",
    });
  }
};

const updateUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, role } = req.body;

    // Make sure at least one editable field is provided
    if (status === undefined && role === undefined) {
      return res.status(400).json({
        success: false,
        message: "Nothing to update",
      });
    }

    // Validate status
    if (
      status !== undefined &&
      !["active", "restricted", "blocked"].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid user status",
      });
    }

    // Validate role
    if (role !== undefined && !["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role",
      });
    }

    // Find user
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    /*
     * Prevent an admin from accidentally
     * blocking/restricting/demoting themselves.
     */
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot modify your own admin account",
      });
    }

    // Update allowed fields only
    if (status !== undefined) {
      user.status = status;
    }

    if (role !== undefined) {
      user.role = role;
    }

    await user.save();

    // Never return password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Update user by admin error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the user",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  loginAdmin,
  getUsers,
  getUserById,
  updateUserByAdmin,
};
