const express = require("express");

const app = express();

app.use(express.json());

// ROUTES
app.use(
  "/api/events",
  require("./modules/event/event.routes")
);

module.exports = app;
