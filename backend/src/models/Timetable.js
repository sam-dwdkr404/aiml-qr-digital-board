const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    start: { type: String, required: true },
    end: { type: String, required: true },
    portion: { type: String, default: "" }
  },
  { _id: false }
);

const timetableSchema = new mongoose.Schema(
  {
    day: { type: String, required: true, unique: true },
    entries: { type: [entrySchema], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Timetable", timetableSchema);
