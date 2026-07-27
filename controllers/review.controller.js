const asyncWrapper = require("../middlewares/asnyc.wrapper");
const responseStatus = require("../constants/response.status");
const logger = require("../utils/logger");

const addReview = asyncWrapper(async (req, res) => {});
const updateReview = asyncWrapper(async (req, res) => {});
const deleteReview = asyncWrapper(async (req, res) => {});
const getCourseReviews = asyncWrapper(async (req, res) => {});
const getReviewById = asyncWrapper(async (req, res) => {});

module.exports = {
  addReview,
  updateReview,
  deleteReview,
  getCourseReviews,
  getReviewById,
};
