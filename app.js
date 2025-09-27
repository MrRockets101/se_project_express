const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;
//const userRouter = require("./routes/user");

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connect to DB");
  })
  .catch(console.error);

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: new mongoose.Types.ObjectId("68d59448e0bb1ba442a13af6"),
  };
  next();
});
app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
