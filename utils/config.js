const { PORT = 3001, JWT_SECRET = "dev-secret" } = process.env;

module.exports = {
  PORT,
  JWT_SECRET,
};
