const Review = require("../models/reviews.model");
const AppError = require("../utils/app.error");

/**
 * Middleware that checks if the authenticated user owns the review
 */
module.exports = async (req, res, next) => {
  const reviewId = req.params.reviewId;

  const review = await Review.findById(reviewId).select("student").lean();

  if (!review) {
    throw new AppError("Review not found", 404);
  }

  if (review.student.toString() !== req.user.id && req.user.role !== "admin") {
    throw new AppError(
      "Forbidden: You are not authorized to modify this review",
      403,
    );
  }

  next();
};
