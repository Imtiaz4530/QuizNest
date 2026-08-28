const dns = require("dns");
dns.setServers(["172.18.0.26"]);

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes.js");
const categoryRoutes = require("./routes/categoryRoutes.js");
const examRoutes = require("./routes/examRoutes.js");
const questionRoutes = require("./routes/questionRoutes.js");
const quizAttemptRoutes = require("./routes/quizAttemptRoutes.js");
const quizRoutes = require("./routes/quizRoutes.js");
const leaderboardRoutes = require("./routes/leaderboardRoutes.js");

dotenv.config();

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "QuizNest API is running",
  });
});

app.use("/api/users", userRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/quiz-attempts", quizAttemptRoutes);
app.use("/api/quizzes", quizRoutes);

// admin routes
app.use("/api/categories", categoryRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/questions", questionRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  console.log("DNS:", dns.getServers());
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
