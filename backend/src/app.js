const express = require("express");

const app = express();

app.use(express.json());

const cors = require("cors");

app.use(cors());

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

app.use(
  "/api/payments",
  require(
    "./core/payments/payment.routes"
  )
);

app.use(
  "/api/admin",
  require(
    "./core/admin/admin.routes"
  )
);
module.exports = app;
