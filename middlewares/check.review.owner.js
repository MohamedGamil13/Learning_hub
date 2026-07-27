const Review = require("../models/reviews.model");
const responseStatus = require("../constants/response.status");
module.exports = async (req, res, next) => {
  const reviewId = req.params.reviewId;
  const review = await Review.findById(reviewId);
  if (review.student !== req.user.id) {
    return res.json({
      status: responseStatus.SUCCESS,
      data: {
        message: "Forbidden",
      },
    });
  }
  next();
};
