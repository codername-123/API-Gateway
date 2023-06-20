const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ServerConfig } = require("../../config");

function checkPassword(password, encryptedPassword) {
  try {
    return bcrypt.compareSync(password, encryptedPassword);
  } catch (error) {
    throw error;
  }
}

function createToken(input) {
  try {
    return jwt.sign(input, ServerConfig.JWT_SECRET, {
      expiresIn: ServerConfig.JWT_EXPIRES,
    });
  } catch (error) {
    throw error;
  }
}

function verifyToken(token) {
  try {
    return jwt.verify(token, ServerConfig.JWT_SECRET);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createToken,
  checkPassword,
  verifyToken,
};
