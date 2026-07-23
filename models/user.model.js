const mongoose = require("mongoose");
const UserTypes = require("../utils/user.types");
const Schema = mongoose.Schema;

const User = new Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  type: {
    type: String,
    required: true,
    enum: [
      UserTypes.STUDENT,
      UserTypes.INSTRUCTOR,
      UserTypes.GUEST,
      UserTypes.ADMIN,
    ],
    default: UserTypes.GUEST,
  },
});
