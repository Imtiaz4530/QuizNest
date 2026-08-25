const Exam = require("../models/Exam.js");
const Category = require("../models/Category.js");

const createExam = async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      categoryId,
      icon,
      isActive,
      isPopular,
      order,
    } = req.body;

    // Validate required fields
    if (!title || !slug || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "Title, slug and categoryId are required",
      });
    }

    // Check category exists
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check duplicate title or slug
    const existingExam = await Exam.findOne({
      $or: [{ title: title.trim() }, { slug: slug.toLowerCase().trim() }],
    });

    if (existingExam) {
      return res.status(409).json({
        success: false,
        message: "Exam with this title or slug already exists",
      });
    }

    const exam = await Exam.create({
      title: title.trim(),
      slug: slug.toLowerCase().trim(),
      description: description || "",
      categoryId,
      icon: icon || "",
      isActive: isActive !== undefined ? isActive : true,
      isPopular: isPopular !== undefined ? isPopular : false,
      order: order !== undefined ? order : 0,
    });

    const populatedExam = await Exam.findById(exam._id).populate(
      "categoryId",
      "name slug",
    );

    return res.status(201).json({
      success: true,
      message: "Exam created successfully",
      exam: populatedExam,
    });
  } catch (error) {
    console.error("Create exam error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating exam",
    });
  }
};

const getExams = async (req, res) => {
  try {
    const exams = await Exam.find().populate("categoryId", "name slug").sort({
      order: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: exams.length,
      exams,
    });
  } catch (error) {
    console.error("Get exams error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching exams",
    });
  }
};

const getExamById = async (req, res) => {
  try {
    const { id } = req.params;

    const exam = await Exam.findById(id).populate("categoryId", "name slug");

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    return res.status(200).json({
      success: true,
      exam,
    });
  } catch (error) {
    console.error("Get exam error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching exam",
    });
  }
};

const updateExam = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      slug,
      description,
      categoryId,
      icon,
      isActive,
      isPopular,
      order,
    } = req.body;

    const exam = await Exam.findById(id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    // Check category if categoryId is being changed
    if (categoryId !== undefined) {
      const category = await Category.findById(categoryId);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    // Check duplicate title or slug
    if (title !== undefined || slug !== undefined) {
      const duplicateConditions = [];

      if (title !== undefined) {
        duplicateConditions.push({
          title: title.trim(),
        });
      }

      if (slug !== undefined) {
        duplicateConditions.push({
          slug: slug.toLowerCase().trim(),
        });
      }

      const existingExam = await Exam.findOne({
        _id: { $ne: id },
        $or: duplicateConditions,
      });

      if (existingExam) {
        return res.status(409).json({
          success: false,
          message: "Another exam with this title or slug already exists",
        });
      }
    }

    // Update only provided fields
    if (title !== undefined) {
      exam.title = title.trim();
    }

    if (slug !== undefined) {
      exam.slug = slug.toLowerCase().trim();
    }

    if (description !== undefined) {
      exam.description = description;
    }

    if (categoryId !== undefined) {
      exam.categoryId = categoryId;
    }

    if (icon !== undefined) {
      exam.icon = icon;
    }

    if (isActive !== undefined) {
      exam.isActive = isActive;
    }

    if (isPopular !== undefined) {
      exam.isPopular = isPopular;
    }

    if (order !== undefined) {
      exam.order = order;
    }

    await exam.save();

    const updatedExam = await Exam.findById(exam._id).populate(
      "categoryId",
      "name slug",
    );

    return res.status(200).json({
      success: true,
      message: "Exam updated successfully",
      exam: updatedExam,
    });
  } catch (error) {
    console.error("Update exam error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating exam",
    });
  }
};

const deleteExam = async (req, res) => {
  try {
    const { id } = req.params;

    const exam = await Exam.findById(id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    await exam.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Exam deleted successfully",
    });
  } catch (error) {
    console.error("Delete exam error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting exam",
    });
  }
};

module.exports = {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
};
