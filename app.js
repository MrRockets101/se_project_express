const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const normalizer = require("./utils/normalizer");
const { AppError, handleError } = require("./utils/error");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("DB connection error:", err));

app.use(express.json());

app.use(normalizer);

app.use((req, res, next) => {
  req.user = { _id: new mongoose.Types.ObjectId("68d59448e0bb1ba442a13af6") };
  next();
});

app.use("/", mainRouter);

app.use((req, res, next) => {
  next(new AppError(404, `Route ${req.method} ${req.originalUrl} not found`));
});

app.use((err, req, res, next) => {
  return handleError(err, res);
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
