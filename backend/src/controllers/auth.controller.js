const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let user;

    if (role === "admin") {
      if (!process.env.ADMIN_EMAIL || email !== process.env.ADMIN_EMAIL) {
        return res.status(401).json({ message: "Access Restricted" });
      }
      user = await User.findOne({ email, role });
    } else {
      user = await User.findOne({ role });
    }

    if (!user) {
      return res.status(401).json({ message: "Access Restricted" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};
