const express = require("express");
const { UserController } = require("../../controllers");
const { UserMiddleware } = require("../../middlewares");

const router = express.Router();

/**
 * route->  /api/v1/signup - POST
 */
router.post(
  "/",
  UserMiddleware.validateCreateRequestBody,
  UserController.createUser
);

module.exports = router;
