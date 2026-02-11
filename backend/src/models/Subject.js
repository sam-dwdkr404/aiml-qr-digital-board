const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    name: { type: String, required: true },
    faculty: { type: String, default: "NIL" },
    credits: { type: Number, default: 0 },

    resources: {
      modules: { type: String, default: "Not uploaded" },
      pyq: { type: String, default: "Not uploaded" },
      solutions: { type: String, default: "Not uploaded" },
      modelPapers: { type: String, default: "Not uploaded" },
      assignments: { type: String, default: "Not uploaded" },
      labManual: { type: String, default: "Not applicable" }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subject", subjectSchema);
