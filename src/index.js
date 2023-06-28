const express = require("express");
const { ServerConfig } = require("./config");
const rateLimit = require("express-rate-limit");
const apiRoutes = require("./routes");
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
app.use(
  "/flightservice",
  createProxyMiddleware({
    target: ServerConfig.FLIGHT_SERVICE,
    changeOrigin: true,
    pathRewrite: {
      "^/flightservice": "",
    },
    onProxyReq: fixRequestBody,
    auth: true,
  })
);
app.use(
  "/bookingservice",
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
