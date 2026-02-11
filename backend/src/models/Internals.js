const mongoose = require("mongoose");

const internalsSchema = new mongoose.Schema({
  subjectCode: String,
  cie1: {
    questionPaper: { type: String, default: "Not started" },
    solution: { type: String, default: "In progress" }
  },
  cie2: {
    questionPaper: { type: String, default: "Not started" },
    solution: { type: String, default: "In progress" }
  }
});

module.exports = mongoose.model("Internals", internalsSchema);
