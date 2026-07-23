const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const enrollmentSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: "User", required: true },
  course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  enrollmentAt: { type: Date, default: Date.now },
  progress: { type: Number, required: true, default: 0, min: 0, max: 100 },
  timestamps: true,
});

enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });
