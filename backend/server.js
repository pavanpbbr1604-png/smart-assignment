const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Smart Assignment API running");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/assignments", require("./routes/assignments"));
app.use("/api/submissions", require("./routes/submissions")); // ⭐ IMPORTANT

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});
