const Category = require("../models/Category.js");

const createCategory = async (req, res) => {
  try {
    const { name, slug, description, icon, isActive, order } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Name and slug are required",
      });
    }

    const existingCategory = await Category.findOne({
      $or: [{ name: name.trim() }, { slug: slug.toLowerCase().trim() }],
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category with this name or slug already exists",
      });
    }

    const category = await Category.create({
      name: name.trim(),
      slug: slug.toLowerCase().trim(),
      description: description || "",
      icon: icon || "",
      isActive: isActive !== undefined ? isActive : true,
      order: order !== undefined ? order : 0,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Create category error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating category",
    });
  }
};

// const getCategories = async (req, res) => {
//   try {
//     const categories = await Category.find().sort({
//       order: 1,
//       createdAt: -1,
//     });

//     return res.status(200).json({
//       success: true,
//       count: categories.length,
//       categories,
//     });
//   } catch (error) {
//     console.error("Get categories error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong while fetching categories",
//     });
//   }
// };

const getCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const currentPage = Math.max(Number(page) || 1, 1);
    const perPage = Math.min(Math.max(Number(limit) || 10, 1), 100);

    const skip = (currentPage - 1) * perPage;

    // Get total categories
    const total = await Category.countDocuments();

    // Get paginated categories
    const categories = await Category.find()
      .sort({
        order: 1,
        createdAt: -1,
      })
      .skip(skip)
      .limit(perPage);

    const totalPages = Math.ceil(total / perPage);

    return res.status(200).json({
      success: true,
      categories,
      pagination: {
        page: currentPage,
        limit: perPage,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Get categories error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching categories",
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Get category error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching category",
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, slug, description, icon, isActive, order } = req.body;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check name/slug conflicts
    if (name || slug) {
      const existingCategory = await Category.findOne({
        _id: { $ne: id },
        $or: [
          ...(name ? [{ name: name.trim() }] : []),
          ...(slug ? [{ slug: slug.toLowerCase().trim() }] : []),
        ],
      });

      if (existingCategory) {
        return res.status(409).json({
          success: false,
          message: "Another category with this name or slug already exists",
        });
      }
    }

    if (name !== undefined) {
      category.name = name.trim();
    }

    if (slug !== undefined) {
      category.slug = slug.toLowerCase().trim();
    }

    if (description !== undefined) {
      category.description = description;
    }

    if (icon !== undefined) {
      category.icon = icon;
    }

    if (isActive !== undefined) {
      category.isActive = isActive;
    }

    if (order !== undefined) {
      category.order = order;
    }

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Update category error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating category",
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await category.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting category",
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
