require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/User");

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
const adminName = process.env.ADMIN_NAME || "Admin";

if (!adminEmail || !adminPassword) {
  console.error("Missing ADMIN_EMAIL or ADMIN_PASSWORD in .env");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const hashed = await bcrypt.hash(adminPassword, 10);

  await User.findOneAndUpdate(
    { email: adminEmail, role: "admin" },
    {
      name: adminName,
      email: adminEmail,
      role: "admin",
      password: hashed
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log("Admin upserted/updated ✅");
  process.exit();
});
