const express = require("express");

const router = express.Router();

const controller = require(
  "./event.controller.js"
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

// GET ALL EVENTS
router.get(
  "/",
  controller.getEvents
);

// GET ONE EVENT
router.get(
  "/:id",
  controller.getEventById
);

// CREATE EVENT
router.post(
  "/",
  auth,
  role(["seller", "admin"]),
  upload.array("images", 10),
  controller.createEvent
);

// DELETE EVENT
router.delete(
  "/:id",
  auth,
  controller.deleteEvent
);

module.exports = router;
