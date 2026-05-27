const express = require("express");

const router = express.Router();

const controller = require(
  "./marketplace.controller.js"
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

// GET ALL ITEMS
router.get(
  "/",
  controller.getItems
);

// GET ONE ITEM
router.get(
  "/:id",
  controller.getItemById
);

// CREATE ITEM
router.post(
  "/",
  auth,
  role(["seller", "admin"]),
  upload.array("images", 10),
  controller.createItem
);

// DELETE ITEM
router.delete(
  "/:id",
  auth,
  controller.deleteItem
);

module.exports = router;
