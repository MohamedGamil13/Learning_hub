const express = require("express");
require("dotenv").config();
const app = express();
const connectDB = require("./config/db.config");
const cors = require("cors");
const morgan = require("morgan");
const responseStatus = require("./constants/response.status");

// Import Routes
const userRouter = require("./routes/user.routes");
const coursesRouter = require("./routes/course.route");
const lessonRouter = require("./routes/lesson.route");
const enrollmentRouter = require("./routes/enrollment.route");
const reviewRouter = require("./routes/review.routes");

// Middlewares
app.use(express.static("uploads"));
app.use(cors());
app.use(express.json());

// HTTP request logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
app.use("/api/users", userRouter);
app.use("/api/courses", coursesRouter);
app.use("/api/courses/:courseId/lessons", lessonRouter);
app.use("/api/enrollments", enrollmentRouter);
app.use("/api/reviews", reviewRouter);

// Connect DB
connectDB();

// Default Route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// 404 Handler - For non-existing routes
app.use((req, res) => {
  res.status(404).json({
    status: responseStatus.FAIL,
    data: {
      msg: "Route is not found",
    },
  });
});

// Global Error Handler
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const status = error.status || responseStatus.ERROR;

  const response = {
    status,
    data: {
      error: error.message,
    },
  };

  // In development, include stack trace
  if (process.env.NODE_ENV === "development") {
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
});

const server = app.listen(process.env.PORT_NUMBER, () => {
  console.log("Server is running");
});
