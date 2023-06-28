const { ErrorResponse } = require("../utils/common");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");
const { UserService } = require("../services");

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

async function checkAuth(req, res, next) {
  try {
    const response = await UserService.isAuthenticated(
      req.headers["x-access-token"]
    );
    if (response) {
      req.user = response;
      next();
    }
  } catch (error) {
    return res.status(error.statuscode).json(error);
  }
}

function validateAddRoleRequestBody(req, res, next) {
  if (!req.body.id || !req.body.role) {
    ErrorResponse.message = "Something went wrong";
    ErrorResponse.error = new AppError(
      "Incorrect request body",
      StatusCodes.BAD_REQUEST
    );
    return res.status(ErrorResponse.error.statuscode).json(ErrorResponse);
  }
  next();
}

async function isAuthorized(req, res, next) {
  const admin = await UserService.isAdmin(req.user);
  const flightCompany = await UserService.isFlightCompany(req.user);
  if (!admin && !flightCompany) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "You are not authorized" });
  }
  next();
}
module.exports = {
  validateCreateRequestBody,
  checkAuth,
  isAuthorized,
  validateAddRoleRequestBody,
};
