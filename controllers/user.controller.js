const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const asnycWrapper = require("../middlewares/asnyc.wrapper");
const UserTypes = require("../constants/user.types");
const displayUser = require("../utils/display.user");
const responseStatus = require("../constants/response.status");
const jwtGenrator = require("../utils/generate.token");

const saltRounds = 10;

const regController = asnycWrapper(async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = await userModel.create({
    name,
    email,
    password: hashedPassword,
    role: UserTypes.STUDENT,
  });

  const token = jwtGenrator({ email: email, id: user.id });

  const userObject = displayUser(user);

  res.status(201).json({
    status: responseStatus.SUCCESS,
    data: {
      user: userObject,
      token,
    },
  });
});

const loginController = asnycWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    throw new Error("User does not exist");
  }

  const isPasswordTrue = await bcrypt.compare(password, user.password);

  if (!isPasswordTrue) {
    throw new Error("Wrong password");
  }

  const token = jwtGenerator({
    id: user.id,
    email: user.email,
  });

  const userObject = displayUser(user);

  return res.status(200).json({
    status: responseStatus.SUCCESS,
    message: "User Logged In Successfully",
    data: {
      user: userObject,
      token,
    },
  });
});

module.exports = {
  regController,
  loginController,
};
