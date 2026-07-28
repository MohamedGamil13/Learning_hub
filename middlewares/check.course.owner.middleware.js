const Course = require("../models/courses.model");
const Enrollment = require("../models/enrollment.model");
const AppError = require("../utils/app.error");
const asyncWrapper = require("./asnyc.wrapper");

/**
 * Middleware that checks if the authenticated user is the owner of a course
 * Supports both direct courseId param and enrollmentId param lookup
 * @param {string} paramName - The name of the param containing the course ID
 * @returns {Function} Express middleware
 */
module.exports = (paramName = "courseId") => {
  return asyncWrapper(async (req, res, next) => {
    if (req.user.role === "admin") {
      return next();
    }

    let courseId = req.params[paramName];

    if (!courseId && req.params.enrollmentId) {
      const enrollment = await Enrollment.findById(
        req.params.enrollmentId,
      ).lean();

      if (!enrollment) {
        throw new AppError("Enrollment not found", 404);
      }

      courseId = enrollment.course;
    }

    if (!courseId) {
      throw new AppError("Course ID or Enrollment ID is required", 400);
    }

    const course = await Course.findById(courseId).select("instructor").lean();

    if (!course) {
      throw new AppError("Course not found", 404);
    }

    if (course.instructor.toString() !== req.user.id) {
      throw new AppError(
        "Forbidden: You are not the owner of this course",
        403,
      );
    }

    next();
  });
};
