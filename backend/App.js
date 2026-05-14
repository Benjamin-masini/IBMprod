const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use(
  "/api/auth",
  require("./modules/auth/auth.routes")
);

app.use(
  "/api/users",
  require("./modules/users/users.routes")
);

module.exports = app;