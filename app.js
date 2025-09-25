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

const routes = require("./routes");
app.use(express.json());
app.use(routes);

app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
