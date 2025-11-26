// backend/models/Assignment.js
const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    maxMarks: { type: Number, required: true },
    deadline: { type: Date, required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assignment", assignmentSchema);
