const express = require("express");
const { InfoController } = require("../../controllers");
const signUpRoute = require("./user-routes");
const router = express.Router();

router.get("/info", InfoController.Info);
router.use("/signup", signUpRoute);
module.exports = router;
