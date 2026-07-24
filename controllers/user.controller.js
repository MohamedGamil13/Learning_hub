const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const asnycWrapper = require("../middlewares/asnyc.wrapper");
const UserTypes = require("../constants/user.types");
const displayUser = require("../utils/display.user");
const responseStatus = require("../constants/response.status");
const jwtGenerator = require("../utils/generate.token");

const saltRounds = 10;

const regController = asnycWrapper(async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // تسجل دائماً كـ STUDENT وأنت كـ Admin ترفع حسابه من الداشبورد
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

  res.status(201).json({
    status: responseStatus.SUCCESS,
    data: {
      user: userObject,
      token,
    },
  });
});

const loginController = asnycWrapper(async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(400).json({
      status: responseStatus.FAIL,
      message: "User does not exist",
    });
  }

  const isPasswordTrue = await bcrypt.compare(password, user.password);

  if (!isPasswordTrue) {
    return res.status(400).json({
      status: responseStatus.FAIL,
      message: "Wrong password",
    });
  }

  const token = jwtGenerator({
    id: user.id,
    email: user.email,
    role: user.role,
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
