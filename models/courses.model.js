const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const coureSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  thumbnail: {
    type: String,
  },
  published: {
    type: Boolean,
    default: false,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  ratingsCount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Course", coureSchema);
