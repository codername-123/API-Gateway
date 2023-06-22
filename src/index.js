const express = require("express");
const { ServerConfig } = require("./config");
const rateLimit = require("express-rate-limit");
const apiRoutes = require("./routes");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 3,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(limiter);

app.use(
  "/flightservice",
  createProxyMiddleware({
    target: ServerConfig.FLIGHT_SERVICE,
    changeOrigin: true,
    pathRewrite: {
      "^/flightservice": "/",
    },
  })
);
app.use(
  "/bookingservice",
  createProxyMiddleware({
    target: ServerConfig.BOOKING_SERVICE,
    changeOrigin: true,
    pathRewrite: {
      "^/bookingservice": "/",
    },
  })
);
app.use("/api", apiRoutes);

app.listen(ServerConfig.PORT, () => {
  console.log(`Server started listening on ${ServerConfig.PORT}`);
});
