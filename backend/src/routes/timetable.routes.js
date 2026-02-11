const express = require("express");
const router = express.Router();
const Timetable = require("../models/Timetable");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.get("/", async (_req, res) => {
  try {
    const docs = await Timetable.find().lean();
    const timetableByDay = docs.reduce((acc, doc) => {
      acc[doc.day] = doc.entries || [];
      return acc;
    }, {});
    res.json({ timetableByDay });
  } catch {
    res.status(500).json({ message: "Failed to load timetable" });
  }
});

router.put("/", auth, role("admin"), async (req, res) => {
  try {
    const { timetableByDay = {} } = req.body || {};
    const days = Object.keys(timetableByDay);
    await Promise.all(
      days.map((day) =>
        Timetable.findOneAndUpdate(
          { day },
          { day, entries: timetableByDay[day] || [] },
          { upsert: true, new: true }
        )
      )
    );
    res.json({ message: "Timetable saved" });
  } catch {
    res.status(500).json({ message: "Failed to save timetable" });
  }
});

module.exports = router;
