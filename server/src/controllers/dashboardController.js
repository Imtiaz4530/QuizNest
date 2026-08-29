const User = require("../models/User.js");
const Category = require("../models/Category.js");
const Exam = require("../models/Exam.js");
const Question = require("../models/Question.js");
const QuizAttempt = require("../models/QuizAttempt.js");

const getDashboard = async (req, res) => {
  try {
    // Run independent queries in parallel
    const [
      totalUsers,
      totalCategories,
      totalExams,
      activeExams,
      totalQuestions,
      totalAttempts,
      recentAttempts,
      recentUsers,
      examStats,
      attemptActivity,
    ] = await Promise.all([
      // Total users
      User.countDocuments({
        role: "user",
      }),

      // Total categories
      Category.countDocuments(),

      // Total exams
      Exam.countDocuments(),

      // Active exams
      Exam.countDocuments({
        isActive: true,
      }),

      // Total questions
      Question.countDocuments(),

      // Total quiz attempts
      QuizAttempt.countDocuments(),

      // Recent attempts
      QuizAttempt.find()
        .sort({
          createdAt: -1,
        })
        .limit(10)
        .populate("userId", "name email")
        .populate("examId", "title slug"),

      // Recent users
      User.find({
        role: "user",
      })
        .select("name email role createdAt")
        .sort({
          createdAt: -1,
        })
        .limit(10),

      // Exam statistics
      Exam.aggregate([
        {
          $lookup: {
            from: "quizattempts",
            localField: "_id",
            foreignField: "examId",
            as: "attempts",
          },
        },

        {
          $lookup: {
            from: "questions",
            localField: "_id",
            foreignField: "examId",
            as: "questions",
          },
        },

        {
          $project: {
            _id: 0,
            examId: "$_id",
            title: 1,
            attempts: {
              $size: "$attempts",
            },
            questions: {
              $size: "$questions",
            },
          },
        },

        {
          $sort: {
            attempts: -1,
          },
        },

        {
          $limit: 10,
        },
      ]),

      // Attempts for the last 7 days
      QuizAttempt.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().setDate(new Date().getDate() - 6)),
            },
          },
        },

        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },

            attempts: {
              $sum: 1,
            },
          },
        },

        {
          $sort: {
            _id: 1,
          },
        },
      ]),
    ]);

    // Format recent attempts
    const formattedRecentAttempts = recentAttempts.map((attempt) => ({
      _id: attempt._id,

      user: attempt.userId
        ? {
            _id: attempt.userId._id,
            name: attempt.userId.name,
            email: attempt.userId.email,
          }
        : null,

      exam: attempt.examId
        ? {
            _id: attempt.examId._id,
            title: attempt.examId.title,
            slug: attempt.examId.slug,
          }
        : null,

      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      createdAt: attempt.createdAt,
    }));

    // Format activity and make sure all 7 days exist
    const activityMap = new Map(
      attemptActivity.map((item) => [item._id, item.attempts]),
    );

    const formattedAttemptActivity = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();

      date.setDate(date.getDate() - i);

      const dateString = date.toISOString().split("T")[0];

      formattedAttemptActivity.push({
        date: dateString,
        attempts: activityMap.get(dateString) || 0,
      });
    }

    return res.status(200).json({
      success: true,

      stats: {
        totalUsers,
        totalCategories,
        totalExams,
        activeExams,
        totalQuestions,
        totalAttempts,
      },

      recentAttempts: formattedRecentAttempts,

      recentUsers,

      examStats,

      attemptActivity: formattedAttemptActivity,
    });
  } catch (error) {
    console.error("Get dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching dashboard data",
    });
  }
};

module.exports = {
  getDashboard,
};
