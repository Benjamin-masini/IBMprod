const express = require("express");

const router = express.Router();

const controller = require(
  "./property.controller"
);

const auth = require(
  "../../middleware/auth.middleware"
);

const role = require(
  "../../middleware/role.middleware"
);

const upload = require(
  "../../middleware/upload.middleware"
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