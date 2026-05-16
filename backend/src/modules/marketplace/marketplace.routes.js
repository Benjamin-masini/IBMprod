const express = require("express");

const router = express.Router();

const controller = require(
  "./marketplace.controller"
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