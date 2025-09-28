const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const normalizer = require("./utils/normalizer");
const { AppError, handleError } = require("./utils/error");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(async () => {
    console.log("Connected to DB");
    const WeatherCategory = require("./models/weatherCategory");
    const existing = await WeatherCategory.countDocuments();
    if (existing === 0) {
      await WeatherCategory.insertMany([
        { name: "hot" },
        { name: "warm" },
        { name: "cold" },
      ]);
      console.log("Seeded initial weather categories");
    }
  })
  .catch((err) => console.error("DB connection error:", err));

app.use(express.json());
app.use(normalizer);
app.use((req, res, next) => {
  req.user = { _id: new mongoose.Types.ObjectId("68d59448e0bb1ba442a13af6") };
  next();
});
app.use("/", mainRouter);
app.use((err, req, res, next) => handleError(err, req, res, next));

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
