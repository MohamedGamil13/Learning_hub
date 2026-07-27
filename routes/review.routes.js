const express = require("express");
const reviewRouter = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorization");
const UserTypes = require("../constants/user.types");

// validation import
const validationMiddleware = require("../middlewares/validation.middleware");

// 1. Validation Imports
const {
  validateCourseId,
  validateReviewId,
  createReviewValidation,
  updateReviewValidation,
} = require("../validators/review.validation");

// Controller imports
const {
  addReview,
  updateReview,
  deleteReview,
  getCourseReviews,
  getReviewById,
} = require("../controllers/review.controller");

// 3. Custom Middlewares
const checkReviewOwner = require("../middlewares/check.review.owner");
const checkReviewExist = require("../middlewares/check.review.exist");

// ==================== PUBLIC ROUTES ====================

// Get All Reviews
reviewRouter.get(
  "/course/:courseId",
  validateCourseId,
  validationMiddleware,
  getCourseReviews,
);

// Get  Review
reviewRouter.get(
  "/:reviewId",
  validateReviewId,
  validationMiddleware,
  checkReviewExist,
  getReviewById,
);

// ==================== PROTECTED ROUTES ====================

// Apply Auth globally for all modifying routes below
reviewRouter.use(authMiddleware);

// Add Review (Students Only)
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
  checkReviewExist,
  updateReview,
);

reviewRouter.delete(
  "/:reviewId",
  authorize(UserTypes.STUDENT, UserTypes.INSTRUCTOR, UserTypes.ADMIN),
  validateReviewId,
  validationMiddleware,
  checkReviewExist,
  deleteReview,
);

module.exports = reviewRouter;
