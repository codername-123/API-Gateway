const { ErrorResponse } = require("../utils/common");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");

function validateCreateRequestBody(req, res, next) {
  if (!req.body.email || !req.body.password) {
    ErrorResponse.message = "Something went wrong";
    ErrorResponse.error = new AppError(
      "Incorrect request body",
      StatusCodes.BAD_REQUEST
    );
    return res.status(ErrorResponse.error.statuscode).json(ErrorResponse);
  }
  next();
}

module.exports = {
  validateCreateRequestBody,
};
