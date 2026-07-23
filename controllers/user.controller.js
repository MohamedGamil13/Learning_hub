const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const asnycWrapper = require("../middlewares/asnyc.wrapper");
const UserTypes = require("../constants/user.types");
const displayUser = require("../utils/display.user");
const responseStatus = require("../constants/response.status");

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
  const userObject = displayUser(user);

  res.status(201).json({
    status: responseStatus.SUCCESS,
    data: {
      user: userObject,
    },
  });
});

const loginController = asnycWrapper(async (req, res) => {});

module.exports = {
  regController,
  loginController,
};
