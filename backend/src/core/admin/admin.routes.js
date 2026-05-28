const express = require("express");

const router = express.Router();

const controller = require(
  "./admin.controller.js"
);

const auth = require(
  "../../middleware/auth.middleware.js"
);

const role = require(
  "../../middleware/role.middleware.js"
);

// ADMIN ONLY
router.use(
  auth,
  role(["admin"])
);

// DASHBOARD
router.get(
  "/dashboard",
  controller.getDashboard
);

// USERS
router.get(
  "/users",
  controller.getUsers
);

// BAN USER
router.patch(
  "/users/:id/ban",
  controller.banUser
);

module.exports = router;
