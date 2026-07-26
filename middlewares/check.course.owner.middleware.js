const Course = require("../models/courses.model");
const responseStatus = require("../constants/response.status");
const asyncWrapper = require("./asnyc.wrapper");

module.exports = asyncWrapper(async (req, res, next) => {
  if (req.user.role === "admin") {
    return next();
  }

  const course = await Course.findById(req.params.courseId);

  if (!course) {
    return res.status(404).json({
      status: responseStatus.FAIL,
      data: {
        message: "Course not found",
      },
    });
  }

  if (course.instructor.toString() !== req.user.id) {
    return res.status(403).json({
      status: responseStatus.FAIL,
      data: {
        message: "Forbidden",
      },
    });
  }

  next();
});
