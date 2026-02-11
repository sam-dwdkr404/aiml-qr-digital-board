const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.post("/", auth, role("admin"), async (req, res) => {
  const subject = await Subject.create(req.body);
  res.json(subject);
});

router.get("/", auth, async (req, res) => {
  const subjects = await Subject.find();
  res.json(subjects);
});

module.exports = router;
