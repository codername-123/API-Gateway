const { UserService } = require("../services");
const { StatusCodes } = require("http-status-codes");
const { SuccessResponse, ErrorResponse } = require("../utils/common");

/**
 * POST: /signup
 * req.body: {email: 'abc@xyz.com', password: 'aksjsf'}
 */
async function createUser(req, res) {
  try {
    const user = await UserService.createUser({
      email: req.body.email,
      password: req.body.password,
    });

    SuccessResponse.message = "Successfully created User";
    SuccessResponse.data = user;

    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statuscode).json(ErrorResponse);
  }
}

/**
 * POST: /signin
 * req.body: {email: 'abc@xyz.com', password: 'aksjsf'}
 */
async function signin(req, res) {
  try {
    const jwt = await UserService.signin({
      email: req.body.email,
      password: req.body.password,
    });

    SuccessResponse.message = "Successfully signed in the User";
    SuccessResponse.data = jwt;

    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statuscode).json(ErrorResponse);
  }
}

/**
 * POST: /role
 * req.body: {id: 1, role: 'admin'}
 */
async function addRoleToUser(req, res) {
  try {
    const response = await UserService.addRoleToUser({
      id: req.body.id,
      role: req.body.role,
    });

    SuccessResponse.data = response;

    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statuscode).json(ErrorResponse);
  }
}
module.exports = {
  createUser,
  signin,
  addRoleToUser,
};
