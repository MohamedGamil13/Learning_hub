const express = require("express");
const reviewRouter = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorization");
const UserTypes = require("../constants/user.types");

//controllers
const {
  addReview,
  updateReview,
  deleteReview,
  getCourseReviews,
  getReviewById,
} = require("../controllers/review.controller");

//get Course Reviews
reviewRouter.get("/:courseId", getCourseReviews);

//get Review By Id
reviewRouter.get("/:courseId/:reviewId", getReviewById);

//add Review (for Students Only)
reviewRouter.post("/:courseId", addReview);

//updateReview (for Students only)
reviewRouter.patch("/:courseId", updateReview);

//deleteReview (for Instuctor Only)
reviewRouter.delete("/:courseId", deleteReview);
