const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const AppError = require("./utils/AppError");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected to DB"))
  .catch(console.error);

app.use(express.json());

app.use((req, res, next) => {
  req.user = { _id: new mongoose.Types.ObjectId("68d59448e0bb1ba442a13af6") };
  next();
});

app.use("/", mainRouter);

app.use((req, res, next) => {
  next(new AppError(404, `Route ${req.method} ${req.originalUrl} not found`));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    status: err.status || 500,
    error: err.name || "InternalServerError",
    message: err.message || "Something went wrong",
  });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
