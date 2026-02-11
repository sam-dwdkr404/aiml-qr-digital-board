const express = require("express");
const router = express.Router();
const Resource = require("../models/Resource");
const Setting = require("../models/Setting");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.get("/", async (_req, res) => {
  try {
    const resources = await Resource.find().lean();
    const settings = await Setting.findOne({ key: "globalSyllabusLink" }).lean();
    const resourcesBySubject = resources.reduce((acc, item) => {
      acc[item.subjectCode] = item;
      return acc;
    }, {});

    res.json({
      resourcesBySubject,
      globalSyllabusLink: settings?.value ?? ""
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load resources" });
  }
});

router.put("/", auth, role("admin"), async (req, res) => {
  try {
    const { resourcesBySubject = {}, globalSyllabusLink = "" } = req.body || {};

    const codes = Object.keys(resourcesBySubject);
    await Promise.all(
      codes.map((code) =>
        Resource.findOneAndUpdate(
          { subjectCode: code },
          { ...resourcesBySubject[code], subjectCode: code },
          { upsert: true, new: true }
        )
      )
    );

    await Setting.findOneAndUpdate(
      { key: "globalSyllabusLink" },
      { value: globalSyllabusLink || "" },
      { upsert: true, new: true }
    );

    res.json({ message: "Resources saved" });
  } catch (err) {
    res.status(500).json({ message: "Failed to save resources" });
  }
});

module.exports = router;
