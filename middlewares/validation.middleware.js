const { validationResult } = require("express-validator");
const responseStatus = require("../constants/response.status");
module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: responseStatus.FAIL,
      data: {
        msg: errors.array(),
      },
    });
  }
  next();
};
