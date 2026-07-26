const express = require("express");
require("dotenv").config();
const app = express();
const connectDB = require("./config/db.config");
const cors = require("cors");
const responseStatus = require("./constants/response.status");
const userRouter = require("./routes/user.routes");
const coursesRouter = require("./routes/course.route");
const lessonRouter = require("./routes/lesson.route");
// Middle WaresUsage
app.use(express.static("uploads"));
app.use(cors());
app.use(express.json());
app.use("/api/users/", userRouter);
app.use("/api/courses/", coursesRouter);
app.use("/api/courses/:courseId/lessons", lessonRouter);

//connect DB
connectDB();

//default Route
app.get("/", (req, res) => {
  res.send("Hello World");
});
// For none Existing Route
app.use((req, res) => {
  res.status(404).json({
    status: responseStatus.FAIL,
    data: {
      msg: "Route is not found",
    },
  });
});

//global Error Handlar
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: responseStatus.ERROR,
    data: {
      error: error.message,
    },
  });
});
const server = app.listen(process.env.PORT_NUMBER, () => {
  console.log("Server is running");
});

//just for Test PR Agent
