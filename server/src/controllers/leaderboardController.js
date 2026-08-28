const QuizAttempt = require("../models/QuizAttempt.js");
const Exam = require("../models/Exam.js");
const Category = require("../models/Category.js");

const getLeaderboard = async (req, res) => {
  try {
    const { page = 1, limit = 20, exam, category } = req.query;

    const currentPage = Math.max(Number(page) || 1, 1);
    const perPage = Math.min(Math.max(Number(limit) || 20, 1), 100);

    const skip = (currentPage - 1) * perPage;

    /*
     * Build filters
     */
    const matchStage = {};

    /*
     * Filter by exam slug
     *
     * /api/leaderboard?exam=bcs
     */
    if (exam) {
      const examDoc = await Exam.findOne({
        slug: exam.toLowerCase().trim(),
        isActive: true,
      }).select("_id");

      if (!examDoc) {
        return res.status(200).json({
          success: true,
          leaderboard: [],
          pagination: {
            page: currentPage,
            limit: perPage,
            total: 0,
            totalPages: 0,
          },
        });
      }

      matchStage.examId = examDoc._id;
    }

    /*
     * Filter by category slug
     *
     * /api/leaderboard?category=competitive-exams
     */
    if (category) {
      const categoryDoc = await Category.findOne({
        slug: category.toLowerCase().trim(),
        isActive: true,
      }).select("_id");

      if (!categoryDoc) {
        return res.status(200).json({
          success: true,
          leaderboard: [],
          pagination: {
            page: currentPage,
            limit: perPage,
            total: 0,
            totalPages: 0,
          },
        });
      }

      // Find exams belonging to this category
      const exams = await Exam.find({
        categoryId: categoryDoc._id,
        isActive: true,
      }).select("_id");

      const examIds = exams.map((item) => item._id);

      if (examIds.length === 0) {
        return res.status(200).json({
          success: true,
          leaderboard: [],
          pagination: {
            page: currentPage,
            limit: perPage,
            total: 0,
            totalPages: 0,
          },
        });
      }

      matchStage.examId = {
        $in: examIds,
      };
    }

    /*
     * If both exam and category are provided,
     * make sure the exam belongs to the category.
     */
    if (exam && category) {
      const examDoc = await Exam.findOne({
        _id: matchStage.examId,
        categoryId: {
          $in: await Category.find({
            slug: category.toLowerCase().trim(),
            isActive: true,
          }).distinct("_id"),
        },
        isActive: true,
      }).select("_id");

      if (!examDoc) {
        return res.status(200).json({
          success: true,
          leaderboard: [],
          pagination: {
            page: currentPage,
            limit: perPage,
            total: 0,
            totalPages: 0,
          },
        });
      }
    }

    /*
     * Leaderboard logic:
     *
     * 1. Find attempts
     * 2. Sort highest score first
     * 3. For equal scores, earlier attempt wins
     * 4. Group by user + exam
     * 5. Keep the best attempt for each user/exam
     * 6. Sort again
     */

    const leaderboard = await QuizAttempt.aggregate([
      {
        $match: matchStage,
      },

      {
        $sort: {
          score: -1,
          createdAt: 1,
        },
      },

      {
        $group: {
          _id: {
            userId: "$userId",
            examId: "$examId",
          },

          bestScore: {
            $first: "$score",
          },

          attemptId: {
            $first: "$_id",
          },

          attemptedAt: {
            $first: "$createdAt",
          },
        },
      },

      {
        $sort: {
          bestScore: -1,
          attemptedAt: 1,
        },
      },

      {
        $facet: {
          metadata: [
            {
              $count: "total",
            },
          ],

          data: [
            {
              $skip: skip,
            },
            {
              $limit: perPage,
            },

            {
              $lookup: {
                from: "users",
                localField: "_id.userId",
                foreignField: "_id",
                as: "user",
              },
            },

            {
              $unwind: "$user",
            },

            {
              $lookup: {
                from: "exams",
                localField: "_id.examId",
                foreignField: "_id",
                as: "exam",
              },
            },

            {
              $unwind: "$exam",
            },

            {
              $project: {
                _id: 0,

                user: {
                  _id: "$user._id",
                  name: "$user.name",
                  avatar: "$user.avatar",
                },

                exam: {
                  _id: "$exam._id",
                  title: "$exam.title",
                  slug: "$exam.slug",
                },

                score: "$bestScore",
                attemptId: 1,
                attemptedAt: 1,
              },
            },
          ],
        },
      },
    ]);

    const total = leaderboard[0]?.metadata[0]?.total || 0;

    const data = leaderboard[0]?.data || [];

    const totalPages = Math.ceil(total / perPage);

    /*
     * Add ranking number
     */
    const rankedLeaderboard = data.map((entry, index) => ({
      rank: skip + index + 1,
      ...entry,
    }));

    return res.status(200).json({
      success: true,
      leaderboard: rankedLeaderboard,
      pagination: {
        page: currentPage,
        limit: perPage,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Get leaderboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching leaderboard",
    });
  }
};

module.exports = {
  getLeaderboard,
};
