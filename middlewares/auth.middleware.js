const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ status: "fail", message: "Token is required / Unauthorized" });
  }

  const parts = authHeader.split(" ");
  const bearer = parts[0];
  const token = parts[1];

  if (bearer !== "Bearer" || !token) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid Token format. Format must be: Bearer <token>",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECERT_KEY);

    // هنا بيتم تحديد الـ req.user للـ Controllers القادمة
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ status: "fail", message: "Invalid or expired token" });
  }
};
