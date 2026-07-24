const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  const { authorization } = req.header.authorization;
  if (!authorization) {
    throw new Error("Unauthorized");
  }
  const token = authorization.split(" ")[1];
  const Bearer = authorization.split(" ")[0];
  if (Bearer !== "Bearer") {
    throw new Error("Not Valid Authheader");
  }
  const decoded = jwt.verify(token, process.env.JWT_SECERT_KEY);
  if (!authorization) {
    throw new Error("401 Unauthorized");
  }
  req.user = decoded;
  next();
};
