const responseStatus = require("../constants/response.status");

/**
 * Unified API response handler
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {Object} data - Response data
 * @param {string} message - Optional message
 */
const sendResponse = (res, statusCode, data, message = null) => {
  const response = {
    status: statusCode < 400 ? responseStatus.SUCCESS : responseStatus.FAIL,
  };

  if (message) {
    response.message = message;
  }

  response.data = data;

  return res.status(statusCode).json(response);
};

/**
 * Success response helper
 */
const sendSuccess = (res, data, message = null, statusCode = 200) => {
  return sendResponse(res, statusCode, data, message);
};

/**
 * Created response helper (201)
 */
const sendCreated = (res, data, message = null) => {
  return sendResponse(res, 201, data, message);
};

/**
 * Error response helper
 */
const sendError = (res, message, statusCode = 400, data = null) => {
  const response = {
    status: responseStatus.FAIL,
    message,
  };

  if (data) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  sendResponse,
  sendSuccess,
  sendCreated,
  sendError,
};
