const express = require("express");
const reviewRouter = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorization");
const UserTypes = require("../constants/user.types");
const validationMiddleware = require("../middlewares/validation.middleware");

const {
  validateCourseId,
  validateReviewId,
  createReviewValidation,
  updateReviewValidation,
} = require("../validators/review.validation");

const {
  addReview,
  updateReview,
  deleteReview,
  getCourseReviews,
  getReviewById,
} = require("../controllers/review.controller");

const checkReviewOwner = require("../middlewares/check.review.owner");

// ==================== PUBLIC ROUTES ====================

reviewRouter.get(
  "/course/:courseId",
  validateCourseId,
  validationMiddleware,
  getCourseReviews,
);

reviewRouter.get(
  "/:reviewId",
  validateReviewId,
  validationMiddleware,
  getReviewById,
);

// ==================== PROTECTED ROUTES ====================

reviewRouter.use(authMiddleware);

reviewRouter.post(
  "/:courseId",
  authorize(UserTypes.STUDENT),
  validateCourseId,
  createReviewValidation,
  validationMiddleware,
  addReview,
);

reviewRouter.patch(
  "/:reviewId",
  authorize(UserTypes.STUDENT),
  validateReviewId,
  updateReviewValidation,
  validationMiddleware,
  checkReviewOwner,
  updateReview,
);

reviewRouter.delete(
  "/:reviewId",
  authorize(UserTypes.STUDENT, UserTypes.INSTRUCTOR, UserTypes.ADMIN),
  validateReviewId,
  validationMiddleware,
  checkReviewOwner,
  deleteReview,
);

module.exports = reviewRouter;
