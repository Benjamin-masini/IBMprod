const express = require("express");

const app = express();

app.use(express.json());

const cors = require("cors");

app.use(cors());

const path = require("path");

app.use(
  "/uploads",
  express.static(
    path.join(
      __dirname,
      "../uploads"
    )
  )
);

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
