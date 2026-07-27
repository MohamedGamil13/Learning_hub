const Review = require("../models/reviews.model");
const responseStatus = require("../constants/response.status");
module.exports = async (req, res, next) => {
  const reviewId = req.params.reviewId;
  const review = await Review.findById(reviewId);
  if (review.student !== req.user.id) {
    return res.status(403).json({
      status: responseStatus.SUCCESS,
      data: {
        message: "Forbidden : You are not authorized to delete this review",
      },
    });
  }
  next();
};
