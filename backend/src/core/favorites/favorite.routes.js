const express = require("express");

const router = express.Router();

const controller = require(
  "./favorite.controller"
);

const auth = require(
  "../../middleware/auth.middleware"
);

// ADD
router.post(
  "/",
  auth,
  controller.addFavorite
);

// GET USER FAVORITES
router.get(
  "/",
  auth,
  controller.getFavorites
);

// REMOVE
router.delete(
  "/:id",
  auth,
  controller.removeFavorite
);

module.exports = router;