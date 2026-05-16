const express = require("express");

const app = express();

app.use(express.json());

// ROUTES
app.use(
  "/api/events",
  require("./modules/event/event.routes")
);

app.use(
  "/api/search",
  require(
    "./core/search/search.routes"
  )
);

module.exports = app;
