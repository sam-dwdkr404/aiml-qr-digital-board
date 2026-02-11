const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    url: { type: String, required: true }
  },
  { _id: false }
);

const resourceSchema = new mongoose.Schema(
  {
    subjectCode: { type: String, required: true, unique: true },
    modules: { type: [linkSchema], default: [] },
    modelPapers: { type: [linkSchema], default: [] },
    pyq: { type: [linkSchema], default: [] },
    assignments: { type: [linkSchema], default: [] },
    internals: { type: [linkSchema], default: [] },
    labManuals: { type: [linkSchema], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resource", resourceSchema);
