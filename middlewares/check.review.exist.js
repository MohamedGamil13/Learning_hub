const Review = require("../models/reviews.model");
const responseStatus = require("../constants/response.status");
module.exports = async (req, res, next) => {
  const reviewId = req.params.reviewId;
  const review = await Review.findById(reviewId);
  if (!review) {
    return res.json({
      status: responseStatus.SUCCESS,
      data: {
        message: "Review Not Found",
      },
    });
  }
  next();
};
