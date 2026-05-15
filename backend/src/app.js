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

app.use(
  "/api/properties",
  require("./modules/property/property.routes")
);

app.use(
  "/uploads",
  express.static("uploads")
);

app.use(
  "/api/favorites",
  require("./core/favorites/favorite.routes")
);

app.use(
  "/api/messaging",
  require(
    "./core/messaging/messaging.routes"
  )
);

app.use(
  "/api/marketplace",
  require(
    "./modules/marketplace/marketplace.routes"
  )
);
module.exports = app;
