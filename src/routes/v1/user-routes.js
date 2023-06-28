const express = require("express");
const { UserController } = require("../../controllers");
const { UserMiddleware } = require("../../middlewares");

const router = express.Router();

/**
 * route->  /api/v1/signup - POST
 */
router.post(
  "/signup",
  UserMiddleware.validateCreateRequestBody,
  UserController.createUser
);

/**
 * route->  /api/v1/signin - POST
 */
router.post(
  "/signin",
  UserMiddleware.validateCreateRequestBody,
  UserController.signin
);

/**
 * route->  /api/v1/addrole - POST
 */
router.post(
  "/role",
  UserMiddleware.validateAddRoleRequestBody,
  UserMiddleware.checkAuth,
  UserMiddleware.isAuthorized,
  UserController.addRoleToUser
);
module.exports = router;
