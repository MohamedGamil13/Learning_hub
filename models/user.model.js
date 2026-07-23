const mongoose = require("mongoose");
const UserTypes = require("../constants/user.types");
const Schema = mongoose.Schema;

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },

    role: {
      type: String,
      required: true,
      enum: [
        UserTypes.STUDENT,
        UserTypes.INSTRUCTOR,
        UserTypes.GUEST,
        UserTypes.ADMIN,
      ],
      default: UserTypes.STUDENT,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [emailRegex, "Email Is Not Valid"],
      unique: true,
    },
    password: { type: String, required: true, minLength: 8 },
    avatar: { type: String, default: "" },
    bio: { type: String, required: false },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
