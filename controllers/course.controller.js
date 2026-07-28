const Course = require("../models/courses.model");
const Enrollment = require("../models/enrollment.model");
const asyncWrapper = require("../middlewares/asnyc.wrapper");
const AppError = require("../utils/app.error");
const { sendSuccess, sendCreated } = require("../utils/api.response");

// 1. Get All Courses
const getAllCourses = asyncWrapper(async (req, res) => {
  const allCourses = await Course.find()
    .populate("instructor", "name email")
    .lean();

  sendSuccess(res, { courses: allCourses });
});

// 2. Get Single Course By ID
const getCourseById = asyncWrapper(async (req, res) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId)
    .populate("instructor", "name email")
    .lean();

  if (!course) {
    throw new AppError("No Course Found", 404);
  }

  sendSuccess(res, { course });
});

// 3. Get Enrolled Courses for Logged-in Student
const getEnrolledCourses = asyncWrapper(async (req, res) => {
  const studentId = req.user.id;

  const enrolledCourses = await Enrollment.find({ student: studentId })
    .populate("course")
    .lean();

  sendSuccess(res, { courses: enrolledCourses });
});

// 4. Get Added Courses for Logged-in Instructor
const getAddedCourses = asyncWrapper(async (req, res) => {
  const instructorId = req.user.id;

  const addedCourses = await Course.find({ instructor: instructorId }).lean();

  sendSuccess(res, { courses: addedCourses });
});

// 5. Add New Course
const addCourse = asyncWrapper(async (req, res) => {
  const newCourse = await Course.create({
    ...req.body,
    instructor: req.user.id,
  });

  await newCourse.populate("instructor", "name email");

  sendCreated(res, { course: newCourse });
});

// 6. Edit Course
const editCourse = asyncWrapper(async (req, res) => {
  const { courseId } = req.params;

  const updatedCourse = await Course.findByIdAndUpdate(courseId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedCourse) {
    throw new AppError("Course Not Found", 404);
  }

  sendSuccess(res, { course: updatedCourse });
});

// 7. Delete Course
const deleteCourse = asyncWrapper(async (req, res) => {
  const courseId = req.params.courseId;

  const course = await Course.findByIdAndDelete(courseId);

  if (!course) {
    throw new AppError("Course Not Found", 404);
  }

  sendSuccess(res, { message: "Course Deleted Successfully" });
});

module.exports = {
  getAllCourses,
  getCourseById,
  getEnrolledCourses,
  getAddedCourses,
  addCourse,
  editCourse,
  deleteCourse,
};
