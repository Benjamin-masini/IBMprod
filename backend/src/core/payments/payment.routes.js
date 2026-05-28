const express = require("express");

const router = express.Router();

const controller = require(
  "./payment.controller.js"
);

const auth = require(
  "../../middleware/auth.middleware.js"
);

// CREATE PAYMENT
router.post(
  "/",
  auth,
  controller.createPayment
);

module.exports = router;
