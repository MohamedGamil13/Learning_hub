const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const asyncWrapper = require("../middlewares/asnyc.wrapper");
const UserTypes = require("../constants/user.types");
const displayUser = require("../utils/display.user");
const jwtGenerator = require("../utils/generate.token");
const AppError = require("../utils/app.error");
const { sendCreated, sendSuccess } = require("../utils/api.response");

const saltRounds = 10;

const regController = asyncWrapper(async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = await userModel.create({
    name,
    email,
    password: hashedPassword,
    role: UserTypes.STUDENT,
  });

  const token = jwtGenerator({
    email: user.email,
    id: user.id,
    role: user.role,
  });

  const userObject = displayUser(user);

  sendCreated(res, { user: userObject, token });
});

const loginController = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("User does not exist", 401);
  }

  const isPasswordTrue = await bcrypt.compare(password, user.password);

  if (!isPasswordTrue) {
    throw new AppError("Wrong password", 401);
  }

  const token = jwtGenerator({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const userObject = displayUser(user);

  sendSuccess(res, { user: userObject, token }, "User Logged In Successfully");
});

module.exports = {
  regController,
  loginController,
};
