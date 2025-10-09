const winston = require("winston");
const expressWinston = require("express-winston");

const messageFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(
    ({ level, message, meta, timestamp }) =>
      `${timestamp} ${level}: ${meta?.error?.stack || message}`
  )
);

// suggested for custom logging
const logger = winston.createLogger({
  level: "info",
  format: messageFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "combined.log" }),
    new winston.transports.File({ filename: "error.log", level: "error" }),
  ],
});

const requestLogger = expressWinston.logger({
  transports: logger.transports,
  format: winston.format.json(),
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: false,
});

const errorLogger = expressWinston.errorLogger({
  transports: logger.transports,
  format: winston.format.json(),
});

module.exports = { requestLogger, errorLogger, logger };
