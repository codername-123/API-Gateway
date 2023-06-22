const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  SALT: process.env.SALT,
  JWT_EXPIRES: process.env.JWT_EXPIRES,
  JWT_SECRET: process.env.JWT_SECRET,
  FLIGHT_SERVICE: process.env.FLIGHT_SERVICE,
  BOOKING_SERVICE: process.env.BOOKING_SERVICE,
};
