const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const lessonSchema = new Schema(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    videoUrl: {
      type: String,
      required: true,
      trim: true,
    },

    duration: {
      type: Number,
      default: 0,
      min: 0,
    },

    order: {
      type: Number,
      required: true,
      min: 1,
    },

    isPreview: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Lesson", lessonSchema);
