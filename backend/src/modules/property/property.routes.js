const express = require("express");

const router = express.Router();

const controller = require(
  "./property.controller.js"
);

const auth = require(
  "../../middleware/auth.middleware.js"
);

const role = require(
  "../../middleware/role.middleware.js"
);

const upload = require(
  "../../middleware/upload.middleware.js"
);

// GET ALL
router.get(
  "/",
  controller.getProperties
);

// GET ONE
router.get(
  "/:id",
  controller.getPropertyById
);

// CREATE
router.post(
  "/",
  auth,
  role(["seller", "admin"]),
  upload.array("images", 10),
  controller.createProperty
);

// DELETE
router.delete(
  "/:id",
  auth,
  controller.deleteProperty
);

module.exports = router;
