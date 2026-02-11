const mongoose = require("mongoose");

const dailyUpdateSchema = new mongoose.Schema({
  date: { type: String, required: true },
  subjectCode: String,
  topicCovered: String,
  remarks: { type: String, default: "—" }
});

module.exports = mongoose.model("DailyUpdate", dailyUpdateSchema);
