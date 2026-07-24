const express = require("express");
const asnycWrapper = require("../middlewares/asnyc.wrapper");
const coursesRouter = express.Router();
const authorize = require("../middlewares/authorization");
const {
  getAllCourses,
  getCourseById,
  getEnrolledCourses,
  getAddedCourses,
} = require("../controllers/course.controller");
const UserTypes = require("../constants/user.types");
//route
//get all Courses (For all) done
coursesRouter.get("/", getAllCourses);
//get course by id (for all) done
coursesRouter.get("/:courseId", getCourseById);

//get enrollerd Courses (for Students Only) done
coursesRouter.get(
  "/enrolled_courses/:studentId",
  authorize(UserTypes.STUDENT, UserTypes.ADMIN),
  getEnrolledCourses,
);
//get my Courses  (for instructor who add This Course) done
coursesRouter.get(
  "/added_courses/:instructorId",
  authorize(UserTypes.INSTRUCTOR, UserTypes.ADMIN),
  getAddedCourses,
);
//add Course (For Admin,Instructor Only)
coursesRouter.post("/", asnycWrapper());
//delete Course  (for instructor who add This Course , for admin )
coursesRouter.delete("/", asnycWrapper());
//Publish Course(for instructor who add This Course , for admin )
coursesRouter.patch("/", asnycWrapper());
//unPublish Course(for instructor who add This Course , for admin )
coursesRouter.patch("/", asnycWrapper());
//Upload Thumbnail(for instructor who add This Course , for admin )
coursesRouter.patch("/", asnycWrapper());
//edit course (For Admin,instructor only)
coursesRouter.patch("/", asnycWrapper());
module.exports = coursesRouter;
