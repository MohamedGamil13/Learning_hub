const { validationResult } = require("express-validator");
const responseStatus = require("../constants/response.status");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const regController = async (req, res) => {
  const resivedData = req.body;
  console.log(req.body);
  const errors = validationResult(req);
  console.log(errors.isEmpty());
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: responseStatus.FAIL,
      data: {
        msg: errors.array(),
      },
    });
  }
  const user = new userModel(resivedData);
  const hashedPassword = await bcrypt.hash(user.password, saltRounds);
  user.password = hashedPassword;
  await user.save();

  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.__v;
  res.status(201).json({
    user: userObject,
  });
};
module.exports = regController;
