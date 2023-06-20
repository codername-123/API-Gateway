const express = require("express");
const { InfoController } = require("../../controllers");
const { UserMiddleware } = require("../../middlewares");
const userRoute = require("./user-routes");
const router = express.Router();

router.get("/info", UserMiddleware.checkAuth, InfoController.Info);
router.use("/user", userRoute);
module.exports = router;
