const express = require("express");
const cors = require("cors");

require("dotenv").config();

const connectDB = require("./src/config/db");
connectDB();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./src/routes/auth.routes"));
app.use("/api/subjects", require("./src/routes/subject.routes"));
app.use("/api/resources", require("./src/routes/resources.routes"));
app.use("/api/timetable", require("./src/routes/timetable.routes"));

app.get("/", (req, res) => {
  res.send("AIML QR Digital Board Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
