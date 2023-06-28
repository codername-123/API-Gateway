const express = require("express");
const { ServerConfig } = require("./config");
const rateLimit = require("express-rate-limit");
const apiRoutes = require("./routes");
const { UserMiddleware } = require("./middlewares");
const {
  createProxyMiddleware,
  fixRequestBody,
} = require("http-proxy-middleware");

const app = express();

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 20,
});

app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", apiRoutes);

// Todo: add auth middlewares to connect to flight service and booking service also make the admin checks
// Todo: there has to be a better way to do this because all get routes in flight service don't require auth but in booking service
// Todo: if user has to see there bookings then that be a get request which would require auth
// Todo: also for booking admin check is not required(maybe) because it would be the user creating the bookings
app.use(
  "/flightservice",
  UserMiddleware.checkAuth,
  UserMiddleware.isAuthorized,
  createProxyMiddleware({
    target: ServerConfig.FLIGHT_SERVICE,
    changeOrigin: true,
    pathRewrite: {
      "^/flightservice": "",
    },
    onProxyReq: fixRequestBody,
  })
);
app.use(
  "/bookingservice",
  UserMiddleware.checkAuth,
  UserMiddleware.isAuthorized,
  createProxyMiddleware({
    target: ServerConfig.BOOKING_SERVICE,
    changeOrigin: true,
    pathRewrite: {
      "^/bookingservice": "",
    },
    onProxyReq: fixRequestBody,
  })
);
app.listen(ServerConfig.PORT, () => {
  console.log(`Server started listening on ${ServerConfig.PORT}`);
});
