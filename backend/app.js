const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = 8000;

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/water-vision",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);

app.use(express.json({ limit: "20mb" }));
app.use(cors({ origin: "http://localhost:5173" }));

app.use("/api/users", require("./routes/users"));

app.listen(PORT);
