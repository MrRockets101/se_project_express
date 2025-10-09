const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fetch = require("node-fetch");
const { errors } = require("celebrate");
const mainRouter = require("./routes/index");
const { requestLogger, errorLogger, logger } = require("./middlewares/logger"); // Updated import

const app = express();
const { PORT } = require("./utils/config");
const APIKey = "e955bdfb0e38c1bba3f002b386abe0ce";

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => logger.info("Connected to wtwr_db")) // Use logger
  .catch((err) => logger.error(err));

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// Weather proxy route (no change)
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
    logger.error(`Error fetching weather: ${err.message}`);
    res.status(500).json({ message: "Failed to fetch weather" });
  }
});

app.use(requestLogger);
app.use("/", mainRouter);
app.use(errorLogger);
app.use(errors()); // Handles Celebrate/Joi errors

// Global error handler (new)
app.use((err, req, res, next) => {
  logger.error(`Global error: ${err.message} | Stack: ${err.stack}`);

  let status = 500;
  let message = "Internal Server Error";

  if (err.name === "ValidationError" || err.name === "CastError") {
    status = 400;
    message = err.message || "Bad Request";
  } else if (err.name === "DocumentNotFoundError") {
    status = 404;
    message = "Not Found";
  } else if (err.code === 11000) {
    status = 409;
    message = "Conflict (e.g., duplicate email)";
  } else if (err.status) {
    status = err.status;
    message = err.message;
  }

  res.status(status).json({ message });
});

app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});
