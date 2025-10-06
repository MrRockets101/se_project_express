const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fetch = require("node-fetch");
const mainRouter = require("./routes/index");

const app = express();
const { PORT } = require("./utils/config");
const APIKey = "e955bdfb0e38c1bba3f002b386abe0ce";

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected to wtwr_db"))
  .catch(console.error);

app.use(cors());
app.use(express.json());

//  debug
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Weather proxy route to fix CORS
app.get("/api/weather", async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${APIKey}`
    );

    if (!response.ok) {
      throw new Error(`OpenWeatherMap API returned ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error fetching weather:", err);
    res.status(500).json({ message: "Failed to fetch weather" });
  }
});

app.use("/", mainRouter);
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
