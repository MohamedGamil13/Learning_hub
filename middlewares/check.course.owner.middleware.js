const Course = require("../models/courses.model");
const Enrollment = require("../models/enrollment.model");
const responseStatus = require("../constants/response.status");
const asyncWrapper = require("./asnyc.wrapper");

module.exports = (paramName = "courseId") => {
  return asyncWrapper(async (req, res, next) => {
    if (req.user.role === "admin") {
      return next();
    }

    let courseId = req.params[paramName];

    if (!courseId && req.params.enrollmentId) {
      const enrollment = await Enrollment.findById(req.params.enrollmentId);

      if (!enrollment) {
        return res.status(404).json({
          status: responseStatus.FAIL,
          data: { message: "Enrollment not found" },
        });
      }

      courseId = enrollment.course;
    }

    if (!courseId) {
      return res.status(400).json({
        status: responseStatus.FAIL,
        data: { message: "Course ID or Enrollment ID is required" },
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        status: responseStatus.FAIL,
        data: { message: "Course not found" },
      });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        status: responseStatus.FAIL,
        data: { message: "Forbidden: You are not the owner of this course" },
      });
    }

    next();
  });
};
