const jwt = require("jsonwebtoken");
const AppError = require("../utils/app.error");
const asyncWrapper = require("./asnyc.wrapper");

module.exports = asyncWrapper(async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader) {
    throw new AppError("Token is required / Unauthorized", 401);
  }

  const parts = authHeader.split(" ");
  const bearer = parts[0];
  const token = parts[1];

  if (bearer !== "Bearer" || !token) {
    throw new AppError(
      "Invalid Token format. Format must be: Bearer <token>",
      401,
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECERT_KEY);
  req.user = decoded;
  next();
});
