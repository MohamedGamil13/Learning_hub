const User = require("../models/user.model");
const isEmailExist = async (value) => {
  console.log(value);
  const existingUser = await User.findOne({ email: value });

  if (existingUser) {
    throw new Error("E-mail already in use");
  }

  return true;
};
module.exports = isEmailExist;
